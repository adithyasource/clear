import requests
from flask import Flask, jsonify
from flask import request
import json


app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def handle_request():
    if request.args.get("version"):
        return json.dumps("0.18.0")

    gameName = str(request.args.get("gameName"))

    gameData = requests.get(
        f"https://www.steamgriddb.com/api/v2/search/autocomplete/{gameName}",
        headers={"Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"},
        timeout=30,
    ).content

    return jsonify(json.loads(gameData))


# command to run python -m flask run --debug --port 5002
