import subprocess
from os import read
import re
import yaml
from server.cliwrapper.commands import CliCommand


class CliCommandHandler:
	process = None

	def __init__(self, imsi):
		self.process = subprocess.Popen("/home/birex/UERANSIM/build/nr-cli {imsi}".format(imsi=imsi), shell=True,
		                                stdin=subprocess.PIPE, stdout=subprocess.PIPE, encoding='utf8')
		self.__get_output()  # Delete initial -------$

	def __get_output(self):
		output = ""
		while not output.endswith("\n$ "):  # read output till prompt
			buffer = read(self.process.stdout.fileno(), 4096)
			ansi_escape = re.compile(b'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
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

	def get_info(self):
		return self.__run_command_and_get_dict(CliCommand.Info.value)

	def get_status(self):
		return self.__run_command_and_get_dict(CliCommand.Status.value)
