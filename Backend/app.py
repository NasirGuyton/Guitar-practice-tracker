from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

practice_session = {
    "id": 1,
    "date": datetime.now().strftime("%m-%d-%Y %I:%M %p"),
    "notes": ""
}

@app.route("/api/health")
def health():
    return jsonify(practice_session)


@app.route("/api/session", methods=["GET"])
def get_session():
    return jsonify(practice_session)


@app.route("/api/session", methods=["PUT"])
def update_session():
    data = request.json
    practice_session["notes"] = data.get("notes", "")
    return jsonify(practice_session)

if __name__== "__main__":
    app.run(debug=True)


