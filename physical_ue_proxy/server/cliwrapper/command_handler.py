import os
import re
import subprocess
from os import read

import yaml
import random
import logging

from server.cliwrapper.commands import CliCommand
from server.models.ip_address import IpAddress
from server.models.established_session import EstablishedSession


def destroy_cli_instance(process):
  process.kill()


def get_output(process):
  output = ""
  ansi_escape = re.compile(br'\x1B[@-Z\\-_]|[\x80-\x9A\x9C-\x9F]|(?:\x1B\[|\x9B)[0-?]*[ -/]*[@-~]')
  while not output.endswith("\n$ "):  # read output till prompt
    buffer = read(process.stdout.fileno(), 4096)
    buffer = re.sub(ansi_escape, b'', buffer)
    if not buffer: break  # or till EOF (gdb exited)
    output += buffer.decode('utf-8')
  return output


def remove_useless_characters(string_to_clear):
  patterns = [re.compile(r"----(-)+"), re.compile(r"\$")]
  for pattern in patterns:
    string_to_clear = re.sub(pattern, '', string_to_clear)
  return string_to_clear


def setup_routing(table_name, table_id, interface_name, destination_address, destination_port):
  # TODO: check if table exists
  rules = [f"echo {table_id} {table_name} | tee -a /etc/iproute2/rt_tables",
           f"ip rule add fwmark {table_id} table {table_name}",
           f"ip route add default dev {interface_name} table {table_name}",
           f"iptables -A OUTPUT -p tcp --dport {destination_port} -d {destination_address} -t mangle -j MARK --set-mark {table_id}"]
  for rule in rules:
    logging.getLogger().log(level=50, msg=f"exec {rule}")
    process = subprocess.Popen(
      rule,
      shell=True, stdin=subprocess.PIPE,
      stdout=subprocess.PIPE, encoding='utf8')
    get_output(process)


def remove_routing(table_name, table_id, destination_address, destination_port):
  rules = [f"ip rule del fwmark {table_id} table {table_name}",
           f"iptables -D OUTPUT -p tcp --dport {destination_port} -d {destination_address} -t mangle -j MARK --set-mark {table_id}",
           f"sed -i -e /{table_id}/d /etc/iproute2/rt_tables"]
  for rule in rules:
    print(f"exec {rule}")
    process = subprocess.Popen(
      rule,
      shell=True, stdin=subprocess.PIPE,
      stdout=subprocess.PIPE, encoding='utf8')
    get_output(process)


class CliCommandHandler:
  imsi = None
  expected_interface_number = 0
  pdu_session_id_to_routing_param = {}

  def __init__(self, imsi):
    self.imsi = imsi

  def __get_cli_instance(self):
    process = subprocess.Popen(
      "{base_dir}/build/nr-cli {imsi}".format(base_dir=os.environ.get("UERANSIM_BASE_DIR"), imsi=self.imsi),
      shell=True,
      stdin=subprocess.PIPE, stdout=subprocess.PIPE, encoding='utf8')
    get_output(process)  # Delete initial -------$
    return process

  def __run_command_and_get_dict(self, command):
    process = self.__get_cli_instance()
    process.stdin.write(command)
    process.stdin.flush()
    result = remove_useless_characters(get_output(process=process))
    destroy_cli_instance(process=process)
    try:
      res = yaml.safe_load(result)
      return res
    except yaml.YAMLError as exc:
      print(exc)
      return {}

  def __run_command(self, command):
    process = self.__get_cli_instance()
    process.stdin.write(command)
    process.stdin.flush()
    get_output(process=process)
    destroy_cli_instance(process=process)

  def get_info(self):
    return self.__run_command_and_get_dict(CliCommand.Info.value)

  def get_status(self):
    return self.__run_command_and_get_dict(CliCommand.Status.value)

  def release_pdu_session(self, pdu_id):
    self.__run_command(
      CliCommand.PduSessionRelease.value.format(session_id=pdu_id))
    if pdu_id-1 in self.pdu_session_id_to_routing_param:
      while True:
        interface_information = get_output(
          subprocess.Popen(f"ip a | grep uesimtun{pdu_id - 1}", shell=True,
                           stdin=subprocess.PIPE,
                           stdout=subprocess.PIPE,
                           encoding='utf8'))
        if interface_information == "":
          routing_parameters = self.pdu_session_id_to_routing_param[pdu_id-1]
          remove_routing(table_name=routing_parameters['table_name'],
                         table_id=routing_parameters['table_id'],
                         destination_port=routing_parameters['destination_port'],
                         destination_address=routing_parameters['destination_address'])
          self.pdu_session_id_to_routing_param.pop(pdu_id-1, None)
          self.expected_interface_number -= 1
          break
    return "PDU session release triggered"

  def establish_pdu_session(self, sst, sd, dnn, session_type, end_point_ip, end_point_port):
    self.__run_command(
      CliCommand.PduSessionEstablish.value.format(session_type=session_type, sst=sst, sd=sd, dnn=dnn))
    if end_point_ip is not None and end_point_port is not None:
      while True:
        random_value = str(random.randint(500, 1000))
        table_name = f"ueransim{random_value}"
        self.pdu_session_id_to_routing_param[self.expected_interface_number] = {
          "table_name": table_name,
          "table_id": random_value,
          "destination_port": end_point_port,
          "destination_address": end_point_ip
        }
        interface_information = get_output(
          subprocess.Popen(f"ip a | grep uesimtun{self.expected_interface_number}", shell=True, stdin=subprocess.PIPE,
                           stdout=subprocess.PIPE,
                           encoding='utf8'))
        logging.getLogger().log(level=50, msg=f"{interface_information}")
        if interface_information != "":
          setup_routing(table_id=random_value, table_name=table_name, destination_port=end_point_port,
                        destination_address=end_point_ip,
                        interface_name=f"uesimtun{self.expected_interface_number}")
          self.expected_interface_number += 1
          break
    return "PDU session creation triggered"

  def get_pdu_sessions(self):
    command_results = self.__run_command_and_get_dict(CliCommand.PduSessionList.value)
    command_dictionary = command_results if command_results is not None else {}
    to_be_returned = []
    for key, value in command_dictionary.items():
      to_be_returned.append(EstablishedSession(id=int(re.findall(r'\d+', key)[0]),
                                               emergency=value['emergency'],
                                               pdu_session_type=value['session-type'],
                                               ip_address=IpAddress(ipv4_addr=value['address']),
                                               sst=value['s-nssai']['sst'],
                                               sd="%0.6X" % value['s-nssai']['sd'],
                                               dnn=value['apn']))
    return to_be_returned
