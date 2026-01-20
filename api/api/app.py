import json
import os

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request

app = Flask(__name__)

load_dotenv()

AUTH_TOKEN = os.getenv("AUTH_TOKEN")
FLASK_ENV = os.getenv("FLASK_ENV")


def getCORSURL(request, response):
    if FLASK_ENV == "development":
        return "*"

    allowedOrigins = {"https://tauri.localhost", "tauri://localhost"}

    origin = request.headers.get("Origin")

    if origin in allowedOrigins:
        return origin


@app.route("/", methods=["GET", "POST"])
def handleRequest():
    if not any(request.args.values()):
        return "hey there, how'd you end up here? this is the main website: https://clear.adithya.zip"

    # ? Get the current latest version of 'clear'

    if request.args.get("version"):
        response = jsonify({"clearVersion": "1.0.0"})
        response.headers.add(
            "Access-Control-Allow-Origin",
            getCORSURL(request, response),
        )
        return response

    # ? Get a game's SGDB ID using the game's name

    if request.args.get("gameName"):
        gameName = str(request.args.get("gameName"))

        gameData = requests.get(
            f"https://www.steamgriddb.com/api/v2/search/autocomplete/{gameName}",
            headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
            timeout=30,
        ).content

        response = jsonify(json.loads(gameData))
        response.headers.add(
            "Access-Control-Allow-Origin",
            getCORSURL(request, response),
        )
        return response

    # ? Get a game's SGDB ID using the game's Steam ID

    if request.args.get("steamID"):
        steamID = str(request.args.get("steamID"))

        gameData = requests.get(
            f"https://www.steamgriddb.com/api/v2/games/steam/{steamID}",
            headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
            timeout=30,
        ).content

        response = jsonify(json.loads(gameData))
        response.headers.add(
            "Access-Control-Allow-Origin",
            getCORSURL(request, response),
        )
        return response

    # ? Get links to a game's grids, heroes, logos and icons using the game's SGDB ID

    if request.args.get("assets"):
        gameID = str(request.args.get("assets"))
        length = str(request.args.get("length"))

        gridImageLinks = []
        heroImageLinks = []
        logoImageLinks = []
        iconImageLinks = []

        gridImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/grids/game/{gameID}",
                headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
                timeout=30,
            ).content
        )

        if gridImageData.get("data"):
            if length == "1":
                gridImageLinks.append(gridImageData["data"][0]["thumb"])
            else:
                for x in gridImageData["data"]:
                    gridImageLinks.append(x["thumb"])

        heroImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/heroes/game/{gameID}",
                headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
                timeout=30,
            ).content
        )

        if heroImageData.get("data"):
            if length == "1":
                heroImageLinks.append(heroImageData["data"][0]["thumb"])
            else:
                for x in heroImageData["data"]:
                    heroImageLinks.append(x["thumb"])

        logoImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/logos/game/{gameID}",
                headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
                timeout=30,
            ).content
        )

        if logoImageData.get("data"):
            if length == "1":
                logoImageLinks.append(logoImageData["data"][0]["thumb"])
            else:
                for x in logoImageData["data"]:
                    logoImageLinks.append(x["thumb"])

        iconImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/icons/game/{gameID}",
                headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
                timeout=30,
            ).content
        )

        if iconImageData.get("data"):
            if length == "1":
                iconImageLinks.append(iconImageData["data"][0]["thumb"])
            else:
                for x in iconImageData["data"]:
                    iconImageLinks.append(x["thumb"])

        allImages = {
            "grids": gridImageLinks,
            "heroes": heroImageLinks,
            "logos": logoImageLinks,
            "icons": iconImageLinks,
        }

        response = jsonify(allImages)
        response.headers.add(
            "Access-Control-Allow-Origin",
            getCORSURL(request, response),
        )
        return response

    # ? Get a binary integer list for one grid, hero, logo and icon of a game using the game's SGDB ID
    # * Used only in v1.0.0

    if request.args.get("limitedAssets"):
        gameID = str(request.args.get("limitedAssets"))

        gridImageLinks = []
        heroImageLinks = []
        logoImageLinks = []
        iconImageLinks = []

        gridImageFileBytes = []
        heroImageFileBytes = []
        logoImageFileBytes = []
        iconImageFileBytes = []

        gridImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/grids/game/{gameID}",
                headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
                timeout=30,
            ).content
        )

        if gridImageData["data"] != []:
            for x in gridImageData["data"]:
                gridImageLinks.append(x["thumb"])

            gridImageFile = requests.get(
                gridImageLinks[0],
                timeout=30,
            )
            gridImageFileBytes = list(gridImageFile.content)

        heroImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/heroes/game/{gameID}",
                headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
                timeout=30,
            ).content
        )

        if heroImageData["data"] != []:
            for x in heroImageData["data"]:
                heroImageLinks.append(x["thumb"])
            heroImageFile = requests.get(
                heroImageLinks[0],
                timeout=30,
            )
            heroImageFileBytes = list(heroImageFile.content)

        logoImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/logos/game/{gameID}",
                headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
                timeout=30,
            ).content
        )

        if logoImageData["data"] != []:
            for x in logoImageData["data"]:
                logoImageLinks.append(x["thumb"])
            logoImageFile = requests.get(
                logoImageLinks[0],
                timeout=30,
            )
            logoImageFileBytes = list(logoImageFile.content)

        iconImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/icons/game/{gameID}",
                headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
                timeout=30,
            ).content
        )

        if iconImageData["data"] != []:
            for x in iconImageData["data"]:
                iconImageLinks.append(x["thumb"])
            iconImageFile = requests.get(
                iconImageLinks[0],
                timeout=30,
            )
            iconImageFileBytes = list(iconImageFile.content)

        allImages = {
            "grid": gridImageFileBytes,
            "hero": heroImageFileBytes,
            "logo": logoImageFileBytes,
            "icon": iconImageFileBytes,
        }

        response = jsonify(allImages)
        response.headers.add(
            "Access-Control-Allow-Origin",
            getCORSURL(request, response),
        )
        return response

    # ? Get a binary integer list for the any given image link
    # * Used only in v1.0.0

    if request.args.get("image"):
        link = str(request.args.get("image"))

        imageFile = requests.get(
            link,
            timeout=30,
        )

        imageFileBytes = list(imageFile.content)

        response = jsonify({"image": imageFileBytes})
        response.headers.add(
            "Access-Control-Allow-Origin",
            getCORSURL(request, response),
        )
        return response

    return "hey there, how'd you end up here? this is the main website: https://clear.adithya.zip"


if __name__ == "__main__":
    from waitress import serve

    serve(app, host="0.0.0.0", port=1337)

# activate venv source .venv/bin/activate
# command to run python app.py
