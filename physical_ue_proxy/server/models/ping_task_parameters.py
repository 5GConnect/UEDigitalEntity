# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from server.models.base_model_ import Model
from server import util



class PingTaskParameters(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, address: str=None, pduSessionIp: str=None):  # noqa: E501
        """PingTaskParameters - a model defined in Swagger

        :param address: The address of this PingTaskParameters.  # noqa: E501
        :type address: str
        :param pduSessionIp: The pduSessionIp of this PingTaskParameters.  # noqa: E501
        :type pduSessionIp: str
        """
        self.swagger_types = {
            'address': str,
            'pduSessionIp': str
        }

        self.attribute_map = {
            'address': 'address',
            'pduSessionIp': 'pduSessionIp'
        }
        self._address = address
        self._pduSessionIp = pduSessionIp

    @classmethod
    def from_dict(cls, dikt) -> 'PingTaskParameters':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The PingTaskParameters of this PingTaskParameters.  # noqa: E501
        :rtype: PingTaskParameters
        """
        return util.deserialize_model(dikt, cls)

    @property
    def address(self) -> str:
        """Gets the address of this PingTaskParameters.


        :return: The address of this PingTaskParameters.
        :rtype: str
        """
        return self._address

    @address.setter
    def address(self, address: str):
        """Sets the address of this PingTaskParameters.


        :param address: The address of this PingTaskParameters.
        :type address: str
        """
        if address is None:
            raise ValueError("Invalid value for `address`, must not be `None`")  # noqa: E501

        self._address = address

    @property
    def pduSessionIp(self) -> str:
        """Gets the pduSessionIp of this PingTaskParameters.


        :return: The pduSessionIp of this PingTaskParameters.
        :rtype: str
        """
        return self._pduSessionIp

    @pduSessionIp.setter
    def pduSessionIp(self, pduSessionIp: str):
        """Sets the pduSessionIp of this PingTaskParameters.


        :param pduSessionIp: The pduSessionIp of this PingTaskParameters.
        :type pduSessionIp: str
        """

        self._pduSessionIp = pduSessionIp