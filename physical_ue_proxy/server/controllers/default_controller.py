import connexion
import six

from server.models.selected_session import SelectedSession  # noqa: E501
from server.models.supi import Supi  # noqa: E501
from server import util
from server.controllers.config import *


def create_pdu_session(selected_session):  # noqa: E501
    """create a new PDU Session

    Create a new PDU Session for the UE.  # noqa: E501

    :param selected_session: Selected Session information
    :type selected_session: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        selected_session = SelectedSession.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def get_device_imsi():  # noqa: E501
    """get the device imsi

    Get the imsi of the controlled device  # noqa: E501


    :rtype: Supi
    """
    result = cli_command_handler.get_info()
    return {"deviceId": result['supi']}
