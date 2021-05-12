# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.selected_session import SelectedSession  # noqa: E501
from swagger_server.models.supi import Supi  # noqa: E501
from swagger_server.test import BaseTestCase


class TestDefaultController(BaseTestCase):
    """DefaultController integration test stubs"""

    def test_create_pdu_session(self):
        """Test case for create_pdu_session

        create a new PDU Session
        """
        query_string = [('selected_session', SelectedSession())]
        response = self.client.open(
            '/pduSession',
            method='POST',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_device_imsi(self):
        """Test case for get_device_imsi

        get the device imsi
        """
        response = self.client.open(
            '/deviceId',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
