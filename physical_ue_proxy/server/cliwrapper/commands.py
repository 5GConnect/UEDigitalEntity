import enum


class CliCommand(enum.Enum):
	Info = "info\n"
	Status = "status\n"
	Timers = "timers\n"
	PduSessionEstablish = "ps-establish {session_type} --sst {sst} --sd {sd} --dnn {dnn}\n"
	PduSessionRelease = "ps-release {session_id}\n"
	PduSessionReleaseAll = "ps-release-all\n"
	GnbCoverage = "coverage\n"
	Deregister = "deregister {mode}\n"
