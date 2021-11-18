import sys

import connexion

from server.models.ping_task_parameters import PingTaskParameters
from server.models.selected_session import SelectedSession  # noqa: E501
from server.models.supi import Supi  # noqa: E501
from server.models.gnb_connection_state import GnbConnectionState  # noqa: E501
from server.controllers.config import *
import subprocess


def create_pdu_session(body):  # noqa: E501
  """create a new PDU Session

	Create a new PDU Session for the UE.  # noqa: E501

	:param body:
	:type body: dict | bytes

	:rtype: SessionInfo
	"""

  if connexion.request.is_json:
    body = SelectedSession.from_dict(connexion.request.get_json())  # noqa: E501
    return cli_command_handler.establish_pdu_session(body.sst, body.sd, body.dnn, body.pdu_session_type,
                                                     body.end_point_ip, body.end_point_port)


def delete_pdu_session(pdu_id):
  return cli_command_handler.release_pdu_session(pdu_id)


def get_device_imsi():  # noqa: E501
  """get the device imsi

  Get the imsi of the controlled device  # noqa: E501


  :rtype: Supi
  """
  result = cli_command_handler.get_info()
  return Supi.from_dict(result['supi'])


def get_gnb_connection_state():  # noqa: E501
  """get the device status

  Get the device status  # noqa: E501


  :rtype: DeviceStatus
  """
  status = cli_command_handler.get_status()
  return GnbConnectionState(status=status["cm-state"], camped_cell=str(status["current-cell"]))


def get_pdu_sessions():  # noqa: E501
  """get the established PDU sessions list

	Get the established PDU sessions list.  # noqa: E501


	:rtype: List[SessionInfo]
	"""
  return cli_command_handler.get_pdu_sessions()


def execute_ping(body):  # noqa: E501
  """execute a ping

	execute a ping command  # noqa: E501

	:param body:
	:type body: dict | bytes

	:rtype: str
	"""
  if connexion.request.is_json:
    body = PingTaskParameters.from_dict(connexion.request.get_json())  # noqa: E501
    try:
      interface = subprocess.check_output(
        f"netstat -ie | grep -B1 {body.pduSessionIp} | head -n1 | awk '{{print $1}}'",
        shell=True,
        stderr=subprocess.STDOUT,  # get all output
        universal_newlines=True  # return string not bytes
      )
      interface = interface.rstrip(":\n")
      command = ['ping', '-c', '4', '-i', '0.2', '-W', '1', body.address] if (not interface) else [
        'ping', '-c',
        '4', '-i', '0.2', '-W', '1',
        '-I',
        interface,
        body.address]
      response = subprocess.check_output(
        command,
        stderr=subprocess.STDOUT,  # get all output
        universal_newlines=True  # return string not bytes
      )
    except subprocess.CalledProcessError as exc:
      response = exc.output, 501
    return response
