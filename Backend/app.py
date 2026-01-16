from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = "sessions.json"

def load_sessions():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_sessions(sessions):
    with open(DATA_FILE, "w") as f:
        json.dump(sessions, f, indent=2)


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/api/sessions", methods=["GET"])
def get_sessions():
    return jsonify(load_sessions())

@app.route("/api/sessions", methods=["POST"])
def create_session():
    sessions = load_sessions()

    new_session = {
    "id": len(sessions) + 1,
    "date": datetime.now().strftime("%m-%d-%Y %I:%M %p"),
    "artist": "",
    "song": "",
    "notes": ""
}

    sessions.append(new_session)
    save_sessions(sessions)

    return jsonify(new_session)

@app.route("/api/sessions/<int:session_id>", methods=["PUT"])
def update_session(session_id):
    sessions = load_sessions()

    for session in sessions:
        if session["id"] == session_id:
            session["notes"] = request.json.get("notes", session["notes"])
            session["artist"] = request.json.get("artist", session["artist"])
            session["song"] = request.json.get("song", session["song"])

            save_sessions(sessions)
            return jsonify(session)

    return jsonify({"error": "Session not found"}), 404

@app.route("/api/sessions/<int:session_id>", methods=["GET"])
def get_session(session_id):
    sessions = load_sessions()

    for session in sessions:
        if session["id"] == session_id:
            return jsonify(session)

    return jsonify({"error": "Session not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
