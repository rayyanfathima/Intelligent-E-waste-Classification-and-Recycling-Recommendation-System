# =========================
# IMPORTS
# =========================
from cProfile import label
import os
import random
import numpy as np
from datetime import datetime
from materials_data import materials_map
from material_prices import material_prices
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, decode_predictions, preprocess_input

from flask import Flask, request, jsonify, redirect, url_for, session
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

from database import get_db


# =========================
# FLASK APP SETUP
# =========================
app = Flask(__name__)
app.secret_key = "supersecretkey"
CORS(app)


# =========================
# LOAD TRAINED MODEL
# =========================
model = load_model("ewaste_model.h5")

general_model = MobileNetV2(weights="imagenet")

class_names = [
    "Battery", "Keyboard", "Microwave", "Mobile",
    "Mouse", "PCB", "Player", "Printer",
    "Television", "Washing Machine"
]

VALID_EWASTE_CLASSES = [
    "Battery",
    "Keyboard",
    "Microwave",
    "Mobile",
    "Mouse",
    "PCB",
    "Player",
    "Printer",
    "Television",
    "Washing Machine"
]

ELECTRONIC_KEYWORDS = [
    "keyboard",
    "computer_keyboard",
    "laptop",
    "notebook",
    "desktop_computer",
    "computer",
    "monitor",
    "screen",
    "display",
    "television",
    "tv",
    "mobile",
    "cellphone",
    "smartphone",
    "phone",
    "printer",
    "mouse",
    "microwave",
    "washing_machine",
    "radio",
    "speaker",
    "remote_control",
    "modem",
    "router",
    "circuit_board",
    "pcb",
    "loudspeaker",
    "screen",
    "projector",
    "modem",
    "router",
    "hard_disk",
    "camera",
    "radio",
    "computer_mouse",
    "mouse",
    "trackball",
    "keyboard",
    "laptop",
    "notebook",
    "desktop_computer",
    "monitor",
    "screen",
    "display",
    "television",
    "tv",
    "mobile",
    "cellphone",
    "smartphone",
    "phone",
    "printer",
    "microwave",
    "washing_machine",
    "speaker",
    "remote_control",
    "modem",
    "router",
    "circuit_board",
    "pcb"
]


# =========================
# IMAGE PREDICTION FUNCTION
# =========================
def predict_image(img_path):

    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    predicted_class = class_names[np.argmax(prediction)]
    confidence = float(np.max(prediction)) * 100

    return predicted_class, round(confidence, 2)

def detect_object(img_path):

    img = image.load_img(img_path, target_size=(224,224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)

    img_array = preprocess_input(img_array)

    preds = general_model.predict(img_array)

    label = decode_predictions(preds, top=1)[0][0][1]

    return label

def calculate_value(materials):

    total_value = 0

    for material, percent in materials.items():

        if material in material_prices:

            price = material_prices[material]

            value = (percent / 100) * price

            total_value += value

    return round(total_value,2)

# =========================
# GOOGLE OAUTH SETUP
# =========================
oauth = OAuth(app)

google = oauth.register(
    name='google',
    client_id='292982054180-73m2vtl09e7ckg6fd9vj2c99hlv6dekg.apps.googleusercontent.com',
    client_secret='GOCSPX-OsMnSyt7nB5f9P0TPYWJ3u_uNb',
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'openid email profile'},
)
# ---------------- SIGNUP API ----------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (data["name"], data["email"], data["password"])
        )
        conn.commit()
        return jsonify({"message": "User registered successfully"})
    except:
        return jsonify({"error": "User already exists"}), 400
    finally:
        conn.close()
        
# ---------------- LOGIN API ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email=? AND password=?",
        (data["email"], data["password"])
    )
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({"message": "Login successful"})
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# ---------------- GOOGLE LOGIN ----------------
@app.route("/login/google")
def login_google():
    redirect_uri = url_for("authorize_google", _external=True)
    return google.authorize_redirect(redirect_uri)


@app.route("/authorize/google")
def authorize_google():
    token = google.authorize_access_token()
    resp = google.get("userinfo")
    user_info = resp.json()

    email = user_info["email"]
    name = user_info["name"]

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email=?", (email,))
    user = cursor.fetchone()

    if not user:
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (name, email, "google_user")
        )
        conn.commit()

    conn.close()

    session["user"] = email

    return redirect("http://127.0.0.1:5500/index.html")

@app.route('/predict', methods=['POST'])
def predict():

    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    upload_folder = "uploads"
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    filepath = os.path.join(upload_folder, file.filename)
    file.save(filepath)

    # STEP 1 — Run ewaste classifier
    predicted_class, confidence = predict_image(filepath)

    print("Ewaste prediction:", predicted_class, confidence)

    # STEP 2 — Detect object using MobileNet
    detected_label = detect_object(filepath)

    print("Detected object:", detected_label)

    label = detected_label.lower()

    is_electronic = (
        "mouse" in label or
        "keyboard" in label or
        "laptop" in label or
        "computer" in label or
        "monitor" in label or
        "screen" in label or
        "television" in label or
        "phone" in label or
        "printer" in label or
        "microwave" in label or
        "washing_machine" in label or
        "speaker" in label or
        "remote_control" in label or
        "router" in label or
        "modem" in label
    )

    # STEP 3 — Reject if not electronic OR low confidence
    if not is_electronic and confidence < 60:
        return jsonify({
            "category": "Not an E-Waste Item",
            "confidence": confidence,
            "materials": [],
            "estimated_value": 0,
            "condition": "N/A",
            "recommendations": [
                "This object is not electronic waste.",
                "Please upload an electronic device."
           ]
        })
    
    # Reject unknown classes
    if predicted_class not in VALID_EWASTE_CLASSES:
        return jsonify({
            "category": "Not an E-Waste Item",
            "confidence": confidence,
            "materials": [],
            "estimated_value": 0,
            "condition": "N/A",
            "recommendations": [
                "This object is not electronic waste.",
                "Please upload an electronic device."
            ]
        })

    # STEP 4 — Compute materials and value
    materials = materials_map.get(predicted_class)

    # If predicted class has no material data → not e-waste
    if materials is None or len(materials) == 0:
        return jsonify({
            "category": "Not an E-Waste Item",
            "confidence": confidence,
            "materials": [],
            "estimated_value": 0,
            "condition": "N/A",
            "recommendations": [
                "This object is not electronic waste.",
                "Please upload an electronic device."
            ]
        })

    value = calculate_value(materials)

    materials = materials_map.get(predicted_class, {})

    # If no material composition exists → not e-waste
    if not materials:
        return jsonify({
            "category": "Not an E-Waste Item",
            "confidence": confidence,
            "materials": [],
            "estimated_value": 0,
            "condition": "N/A",
            "recommendations": [
                "This object is not electronic waste.",
                "Please upload an electronic device."
            ]
        })

    value = calculate_value(materials)

    return jsonify({
        "category": predicted_class,
        "confidence": confidence,
        "materials": list(materials.keys()),
        "estimated_value": value,
        "condition": "Good",
        "recommendations": [
            {"name": "Recycle through authorized e-waste center", "link": ""},
            {"name": "Techazar E Cyclers Pvt Ltd", "link": "https://share.google/NQM2oFBgEQWmOShWs"},
            {"name": "WSR Waste and Scrap Recycling", "link": "https://share.google/zeradgpxpErlb71HV"},
            {"name": "DJUNK - PCB Approved E-Waste Management", "link": "https://share.google/LvpSmbNJlNDy1zgxR"}
        ]
    })
if __name__ == "__main__":
    app.run(debug=True)