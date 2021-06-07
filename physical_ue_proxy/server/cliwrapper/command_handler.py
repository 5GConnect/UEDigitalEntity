import os
import re
import subprocess
from os import read

import yaml

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


class CliCommandHandler:
  imsi = None

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

  def establish_pdu_session(self, sst, sd, dnn, session_type):
    self.__run_command(
      CliCommand.PduSessionEstablish.value.format(session_type=session_type, sst=sst, sd=sd, dnn=dnn))
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
