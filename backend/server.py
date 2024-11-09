from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging

app = Flask(__name__)
CORS(app)
mysql = MySQL(app)

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app.config["MYSQL_HOST"] = os.getenv("MYSQL_HOST")
app.config["MYSQL_USER"] = os.getenv("MYSQL_USER")
app.config["MYSQL_PASSWORD"] = os.getenv("MYSQL_PASSWORD")
app.config["MYSQL_DB"] = os.getenv("MYSQL_DB")

@app.route("/", methods=["GET"])
def home():
    pass



@app.route("/goalTypes", methods=["GET, POST"])
def goalTypes():
    pass


@app.route("/goalTypes/goals", methods=["GET, POST"])
def goals():
    pass


