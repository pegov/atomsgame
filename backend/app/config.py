from starlette.config import Config

VERSION = "0.0.1"

config = Config()

DEBUG: bool = config("DEBUG", cast=bool, default=True)
