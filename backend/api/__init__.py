from flask import flask
from flask.app import Flask

def create_app():
  app = Flask(__name__)

  return app