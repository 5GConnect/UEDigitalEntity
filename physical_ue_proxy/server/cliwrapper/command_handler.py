import subprocess
from os import read
import re
import yaml
from server.cliwrapper.commands import CliCommand
import time
import threading
from server.models.ip_address import IpAddress
from server.models.ipv4_addr import Ipv4Addr
from server.models.session_info import SessionInfo
class CliCommandHandler:
	process = None

	def __init__(self, imsi):
		self.process = subprocess.Popen("/home/birex/UERANSIM/build/nr-cli {imsi}".format(imsi=imsi), shell=True,
		                                stdin=subprocess.PIPE, stdout=subprocess.PIPE, encoding='utf8')
		self.__get_output()  # Delete initial -------$

	def synchronized(func):

		func.__lock__ = threading.Lock()

		def synced_func(*args, **kws):
			with func.__lock__:
				return func(*args, **kws)

		return synced_func

	def __get_output(self):
		output = ""
		ansi_escape = re.compile(
			b'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')  # '\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])'
		while not output.endswith("\n$ "):  # read output till prompt
			buffer = read(self.process.stdout.fileno(), 4096)
			buffer = re.sub(ansi_escape, b'', buffer)
			if not buffer: break  # or till EOF (gdb exited)
			output += buffer.decode('utf-8')
		return output

	def __remove_useless_characters(self, string_to_clear):
		patterns = [re.compile(r"----(-)+"), re.compile(r"\$")]
		for pattern in patterns:
			string_to_clear = re.sub(pattern, '', string_to_clear)
		return string_to_clear

	def __run_command_and_get_dict(self, command):
		self.process.stdin.write(command)
		self.process.stdin.flush()
		result = self.__remove_useless_characters(self.__get_output())
		return yaml.safe_load(result)

	def __run_command(self, command):
		self.process.stdin.write(command)
		self.process.stdin.flush()
		self.__get_output()

	@synchronized
	def get_info(self):
		return self.__run_command_and_get_dict(CliCommand.Info.value)

	@synchronized
	def get_status(self):
		return self.__run_command_and_get_dict(CliCommand.Status.value)

	@synchronized
	def establish_pdu_session(self, sst, sd, dnn, session_type):
		# Technical Debt: We do not need to check pdu session with status command, but with SMF API (event subscriptio).
		# The API is not available in O5GS already.
		pdu_sessions = self.__run_command_and_get_dict(CliCommand.Status.value)['pdu-sessions']
		pdu_sessions_actual_length = pdu_sessions_previous_length = 0 if pdu_sessions is None else len(pdu_sessions)
		self.__run_command(
			CliCommand.PduSessionEstablish.value.format(session_type=session_type, sst=sst, sd=sd, dnn=dnn))
		actual_time = time.time()
		end_time = actual_time + 0.5
		while actual_time < end_time and pdu_sessions_previous_length >= pdu_sessions_actual_length:
			pdu_sessions = self.__run_command_and_get_dict(CliCommand.Status.value)
			pdu_sessions = pdu_sessions['pdu-sessions']
			actual_time = time.time()
			pdu_sessions_actual_length = 0 if pdu_sessions is None else len(pdu_sessions)
		if pdu_sessions is not None:
			result = pdu_sessions[-1]
			return SessionInfo(id=result['id'], emergency=result['emergency'], ip_address=result['address'])
