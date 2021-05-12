import subprocess
from os import read
import re
from aiohttp import web
import yaml


def get_output():
	output = ""
	while not output.endswith("\n$ "):  # read output till prompt
		buffer = read(process.stdout.fileno(), 4096)
		ansi_escape = re.compile(b'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
		buffer = re.sub(ansi_escape, b'', buffer)
		if (not buffer): break  # or till EOF (gdb exited)
		output += buffer.decode('utf-8')
	return output


routes = web.RouteTableDef()


@routes.get('/')
async def hello(request):
	process.stdin.write("info\n")
	process.stdin.flush()
	result = get_output()
	patterns = [re.compile(r"----(-)+"), re.compile(r"\$")]
	for pattern in patterns:
		result = re.sub(pattern, '', result)
	print(result)
	dct = yaml.safe_load(result)
	return web.Response(text=result)


process = subprocess.Popen("/home/birex/UERANSIM/build/nr-cli imsi-901700000000001",
                           shell=True,
                           stdin=subprocess.PIPE,
                           stdout=subprocess.PIPE,
                           encoding='utf8')

get_output()  # Delete initial -------$

if __name__ == '__main__':
	app = web.Application()
	app.add_routes(routes)
	# Technical debdt: static info in code. TODO: fix.
	web.run_app(app, port=8888)
