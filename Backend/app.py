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

# GET all sessions 
@app.route("/api/sessions", methods=["GET"])
def get_sessions():
    sessions = load_sessions()
    artist = request.args.get("artist")

    for session in sessions:
        if "sections" not in session:
            session["sections"] = []

    if artist:
        sessions = [
            s for s in sessions
            if s.get("artist", "").lower() == artist.lower()
        ]

    return jsonify(sessions)

#GET single session by ID
@app.route("/api/sessions/<int:session_id>", methods=["GET"])
def get_session(session_id):
    sessions = load_sessions()

    for session in sessions:
        if session["id"] == session_id:
            if "sections" not in session:
                session["sections"] = []
            return jsonify(session)

    return jsonify({"error": "Session not found"}), 404

#Create new session
@app.route("/api/sessions", methods=["POST"])
def create_session():
    sessions = load_sessions()

    new_session = {
        "id": len(sessions) + 1,
        "date": datetime.now().strftime("%m-%d-%Y %I:%M %p"),
        "artist": "",
        "song": "",
        "sections": []
    }

    sessions.append(new_session)
    save_sessions(sessions)

    return jsonify(new_session)

#Update session
@app.route("/api/sessions/<int:session_id>", methods=["PUT"])
def update_session(session_id):
    sessions = load_sessions()

    for session in sessions:
        if session["id"] == session_id:
            session["artist"] = request.json.get("artist", session["artist"])
            session["song"] = request.json.get("song", session["song"])
            session["sections"] = request.json.get("sections", session["sections"])

            save_sessions(sessions)
            return jsonify(session)

    return jsonify({"error": "Session not found"}), 404

#Delete session
@app.route("/api/sessions/<int:session_id>", methods=["DELETE"])
def delete_session(session_id):
    sessions = load_sessions()
    new_sessions = [s for s in sessions if s["id"] != session_id]

    if len(new_sessions) == len(sessions):
        return jsonify({"error": "Session not found"}), 404

    save_sessions(new_sessions)
    return jsonify({"status": "deleted"})



if __name__ == "__main__":
    app.run(debug=True)
