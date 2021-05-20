#!/usr/bin/env python3

import connexion
from server import encoder
from dotenv import load_dotenv
load_dotenv()

def main():
    app = connexion.App(__name__, specification_dir='./swagger/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml', arguments={'title': 'PhysicalUEProxy API'}, pythonic_params=True)
    app.run(port=8082)


if __name__ == '__main__':
    main()
