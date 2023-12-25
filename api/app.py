import requests
from flask import Flask, jsonify
from flask import request
import json

app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def handleRequest():
    if not any(request.args.values()):
        return "hey there, how'd you end up here? this is the main website: https://clear.adithya.zip"

    if request.args.get("version"):
        response = jsonify({"clearVersion": "0.18.0"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    if request.args.get("gameName"):
        gameName = str(request.args.get("gameName"))

        gameData = requests.get(
            f"https://www.steamgriddb.com/api/v2/search/autocomplete/{gameName}",
            headers={"Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"},
            timeout=30,
        ).content

        response = jsonify(json.loads(gameData))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    if request.args.get("steamID"):
        steamID = str(request.args.get("steamID"))

        gameData = requests.get(
            f"https://www.steamgriddb.com/api/v2/games/steam/{steamID}",
            headers={"Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"},
            timeout=30,
        ).content

        response = jsonify(json.loads(gameData))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    # if request.args.get("assets"):
    #     gameID = str(request.args.get("assets"))
    #     imageType = str(request.args.get("imageType"))
    #     imageIndex = int(request.args.get("imageIndex"))

    #     if imageType == "grid":
    #         gridImageData = json.loads(
    #             requests.get(
    #                 f"https://www.steamgriddb.com/api/v2/grids/game/{gameID}",
    #                 headers={
    #                     "Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"
    #                 },
    #                 timeout=30,
    #             ).content
    #         )

    #         gridImageLink = gridImageData["data"][imageIndex]["thumb"]

    #         gridImageFile = requests.get(
    #             gridImageLink,
    #             timeout=30,
    #         )

    #         gridImageFileBytes = list(gridImageFile.content)

    #         response = jsonify({"grid": gridImageFileBytes})
    #         response.headers.add("Access-Control-Allow-Origin", "*")
    #         return response

    #     if imageType == "hero":
    #         heroImageData = json.loads(
    #             requests.get(
    #                 f"https://www.steamgriddb.com/api/v2/heroes/game/{gameID}",
    #                 headers={
    #                     "Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"
    #                 },
    #                 timeout=30,
    #             ).content
    #         )

    #         heroImageLink = heroImageData["data"][imageIndex]["thumb"]

    #         heroImageFile = requests.get(
    #             heroImageLink,
    #             timeout=30,
    #         )

    #         heroImageFileBytes = list(heroImageFile.content)

    #         response = jsonify({"hero": heroImageFileBytes})
    #         response.headers.add("Access-Control-Allow-Origin", "*")
    #         return response

    #     if imageType == "logo":
    #         logoImageData = json.loads(
    #             requests.get(
    #                 f"https://www.steamgriddb.com/api/v2/logos/game/{gameID}",
    #                 headers={
    #                     "Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"
    #                 },
    #                 timeout=30,
    #             ).content
    #         )

    #         logoImageLink = logoImageData["data"][imageIndex]["thumb"]

    #         logoImageFile = requests.get(
    #             logoImageLink,
    #             timeout=30,
    #         )

    #         logoImageFileBytes = list(logoImageFile.content)

    #         response = jsonify({"logo": logoImageFileBytes})
    #         response.headers.add("Access-Control-Allow-Origin", "*")
    #         return response

    #     if imageType == "icon":
    #         iconImageData = json.loads(
    #             requests.get(
    #                 f"https://www.steamgriddb.com/api/v2/icons/game/{gameID}",
    #                 headers={
    #                     "Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"
    #                 },
    #                 timeout=30,
    #             ).content
    #         )

    #         iconImageLink = iconImageData["data"][imageIndex]["thumb"]

    #         iconImageFile = requests.get(
    #             iconImageLink,
    #             timeout=30,
    #         )

    #         iconImageFileBytes = list(iconImageFile.content)

    #         response = jsonify({"icon": iconImageFileBytes})
    #         response.headers.add("Access-Control-Allow-Origin", "*")
    #         return response

    #     return "response"

    if request.args.get("assets"):
        gameID = str(request.args.get("assets"))

        gridImageLinks = []
        heroImageLinks = []
        logoImageLinks = []
        iconImageLinks = []

        gridImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/grids/game/{gameID}",
                headers={"Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"},
                timeout=30,
            ).content
        )

        for x in gridImageData["data"]:
            gridImageLinks.append(x["thumb"])

        heroImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/heroes/game/{gameID}",
                headers={"Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"},
                timeout=30,
            ).content
        )

        for x in heroImageData["data"]:
            heroImageLinks.append(x["thumb"])

        logoImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/logos/game/{gameID}",
                headers={"Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"},
                timeout=30,
            ).content
        )

        for x in logoImageData["data"]:
            logoImageLinks.append(x["thumb"])

        iconImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/icons/game/{gameID}",
                headers={"Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"},
                timeout=30,
            ).content
        )

        for x in iconImageData["data"]:
            iconImageLinks.append(x["thumb"])

        allImages = {
            "grids": gridImageLinks,
            "heroes": heroImageLinks,
            "logos": logoImageLinks,
            "icons": iconImageLinks,
        }

        response = jsonify(allImages)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    if request.args.get("limitedAssets"):
        gameID = str(request.args.get("limitedAssets"))

        gridImageLinks = []
        heroImageLinks = []
        logoImageLinks = []
        iconImageLinks = []

        gridImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/grids/game/{gameID}",
                headers={"Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"},
                timeout=30,
            ).content
        )

        for x in gridImageData["data"]:
            gridImageLinks.append(x["thumb"])

        heroImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/heroes/game/{gameID}",
                headers={"Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"},
                timeout=30,
            ).content
        )

        for x in heroImageData["data"]:
            heroImageLinks.append(x["thumb"])

        logoImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/logos/game/{gameID}",
                headers={"Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"},
                timeout=30,
            ).content
        )

        for x in logoImageData["data"]:
            logoImageLinks.append(x["thumb"])

        iconImageData = json.loads(
            requests.get(
                f"https://www.steamgriddb.com/api/v2/icons/game/{gameID}",
                headers={"Authorization": "Bearer 02469044c89b4c09df44b6a79579018d"},
                timeout=30,
            ).content
        )

        for x in iconImageData["data"]:
            iconImageLinks.append(x["thumb"])

        gridImageFile = requests.get(
            gridImageLinks[0],
            timeout=30,
        )

        gridImageFileBytes = list(gridImageFile.content)
        heroImageFile = requests.get(
            heroImageLinks[0],
            timeout=30,
        )
        heroImageFileBytes = list(heroImageFile.content)
        logoImageFile = requests.get(
            logoImageLinks[0],
            timeout=30,
        )
        logoImageFileBytes = list(logoImageFile.content)

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
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    return "hey there, how'd you end up here? this is the main website: https://clear.adithya.zip"


# command to run python -m flask run --debug --port 5002
