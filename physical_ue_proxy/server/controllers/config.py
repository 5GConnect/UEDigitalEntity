import os
import subprocess
import time
import yaml

from server.cliwrapper.command_handler import CliCommandHandler

ueransim_base_dir = os.environ.get("UERANSIM_BASE_DIR")
ue_config_file = "{base_dir}/config/{ue_config}".format(base_dir=ueransim_base_dir,
                                                        ue_config=os.environ.get("UE_CONFIG_FILE"))
with open(ue_config_file, 'r') as stream:
  try:
    loaded_file = yaml.safe_load(stream)
    ue_imsi = loaded_file['supi']
    subprocess.Popen("{base_dir}/build/nr-ue -r -c {ue_config}".format(base_dir=ueransim_base_dir,
                                                                    ue_config=ue_config_file),
                     shell=True)
    time.sleep(0.5)  # make sure UE is started
    cli_command_handler = CliCommandHandler(ue_imsi)
  except yaml.YAMLError as exc:
    print(exc)
