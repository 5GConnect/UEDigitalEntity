import sys

import connexion

from server.models.selected_session import SelectedSession  # noqa: E501
from server.models.supi import Supi  # noqa: E501
from server.models.gnb_connection_state import GnbConnectionState  # noqa: E501
from server.controllers.config import *
from pythonping import  ping

def create_pdu_session(body):  # noqa: E501
  """create a new PDU Session

    Create a new PDU Session for the UE.  # noqa: E501

    :param body:
    :type body: dict | bytes

    :rtype: SessionInfo
    """

  if connexion.request.is_json:
    body = SelectedSession.from_dict(connexion.request.get_json())  # noqa: E501
    return cli_command_handler.establish_pdu_session(body.sst, body.sd, body.dnn, body.pdu_session_type)


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

def execute_ping():
  try:
    result_list = ping("google.com")
    return result_list.__repr__(), 200
  except PermissionError:
    return "Physical proxy should run with sudo privileges", 501
  except:
    return "Generic error", 500
