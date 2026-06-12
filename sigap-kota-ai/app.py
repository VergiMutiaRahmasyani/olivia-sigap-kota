from flask import Flask, request, jsonify
from ultralytics import YOLO
from flask_cors import CORS
import tempfile
import os

app = Flask(__name__)
CORS(app)

# Pastikan file 'best.pt' berada di folder yang sama dengan app.py
model = YOLO("best.pt")

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files["image"]
    
    # Perbaikan: Tambahkan suffix='.jpg' agar YOLO mengenali format filenya
    temp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    try:
        image.save(temp.name)
        temp.close()  # Tutup file agar bisa dibaca oleh YOLO

        # Melakukan prediksi
        results = model(temp.name)

        potholes = 0
        cracks = 0
        manholes = 0

        # Menghitung deteksi
        for box in results[0].boxes:
            cls = int(box.cls)
            if cls == 0:
                potholes += 1
            elif cls == 1:
                cracks += 1
            elif cls == 2:
                manholes += 1

        # Logika perhitungan score
        score = (potholes * 20) + (cracks * 10)
        score = min(score, 100) # Pastikan tidak lebih dari 100

        if score >= 70:
            severity = "parah"
        elif score >= 40:
            severity = "sedang"
        else:
            severity = "ringan"

        return jsonify({
            "potholes": potholes,
            "cracks": cracks,
            "manholes": manholes,
            "severity": severity,
            "score": score
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        # Perbaikan: Pastikan file sampah dihapus meskipun terjadi error
        if os.path.exists(temp.name):
            os.remove(temp.name)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)