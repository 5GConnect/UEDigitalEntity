# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from server.models.base_model_ import Model
from server.models.cell_connection_status import CellConnectionStatus  # noqa: F401,E501
from server import util


class GnbConnectionState(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, status: CellConnectionStatus=None, camped_cell: str=None):  # noqa: E501
        """GnbConnectionState - a model defined in Swagger

        :param status: The status of this GnbConnectionState.  # noqa: E501
        :type status: CellConnectionStatus
        :param camped_cell: The camped_cell of this GnbConnectionState.  # noqa: E501
        :type camped_cell: str
        """
        self.swagger_types = {
            'status': CellConnectionStatus,
            'camped_cell': str
        }

        self.attribute_map = {
            'status': 'status',
            'camped_cell': 'camped-cell'
        }
        self._status = status
        self._camped_cell = camped_cell

    @classmethod
    def from_dict(cls, dikt) -> 'GnbConnectionState':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The GnbConnectionState of this GnbConnectionState.  # noqa: E501
        :rtype: GnbConnectionState
        """
        return util.deserialize_model(dikt, cls)

    @property
    def status(self) -> CellConnectionStatus:
        """Gets the status of this GnbConnectionState.


        :return: The status of this GnbConnectionState.
        :rtype: CellConnectionStatus
        """
        return self._status

    @status.setter
    def status(self, status: CellConnectionStatus):
        """Sets the status of this GnbConnectionState.


        :param status: The status of this GnbConnectionState.
        :type status: CellConnectionStatus
        """
        if status is None:
            raise ValueError("Invalid value for `status`, must not be `None`")  # noqa: E501

        self._status = status

    @property
    def camped_cell(self) -> str:
        """Gets the camped_cell of this GnbConnectionState.


        :return: The camped_cell of this GnbConnectionState.
        :rtype: str
        """
        return self._camped_cell

    @camped_cell.setter
    def camped_cell(self, camped_cell: str):
        """Sets the camped_cell of this GnbConnectionState.


        :param camped_cell: The camped_cell of this GnbConnectionState.
        :type camped_cell: str
        """

        self._camped_cell = camped_cell
