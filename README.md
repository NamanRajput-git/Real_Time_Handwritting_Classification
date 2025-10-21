

# ✍️ Real-Time Handwriting Classifier

A **real-time handwriting recognition web app** built with **FastAPI**, **TensorFlow**, and **Docker**.
Users can **draw digits**, **upload images**, or **capture input via webcam** — and the model predicts the handwritten number instantly.

---

## 🚀 Features

* 🖊️ Draw directly on a digital canvas
* 📸 Capture from webcam
* 🗂️ Upload existing handwritten images
* ⚙️ FastAPI backend serving TensorFlow model predictions
* 🐳 Dockerized setup for quick deployment

---

## 🧠 Tech Stack

| Layer          | Technology                                  |
| -------------- | ------------------------------------------- |
| **Frontend**   | HTML, CSS, JavaScript (Canvas + Webcam API) |
| **Backend**    | FastAPI (Python)                            |
| **Model**      | TensorFlow/Keras trained on MNIST           |
| **Deployment** | Docker                                      |

---

## 🗂️ Project Structure

```
.
├── app/
│   ├── main.py          # FastAPI backend
│   ├── best_model.h5    # Trained model
│   └── static/          # Frontend files
├── requirements.txt
├── Dockerfile
└── README.md
```

---

## ⚙️ Backend API

**Endpoint:** `POST /predict`
**Request Body:**

```json
{ "pixels": [0.0, 0.12, 0.98, ...] }
```

**Response:**

```json
{ "prediction": 3 }
```

### Run Locally

```bash
uvicorn app.main:app --host 0.0.0.0 --port 7860
```

API Docs: **[http://localhost:7860/docs](http://localhost:7860/docs)**

---

## 🐳 Docker Setup

**Dockerfile**

```dockerfile
FROM python:3.10-slim
WORKDIR /code
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./app ./app
EXPOSE 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

### Build & Run

```bash
docker build -t handwriting-classifier .
docker run -p 7860:7860 handwriting-classifier
```

---

## 🧩 Frontend Overview

The JavaScript frontend lets users:

* Draw on a black 280×280 canvas
* Capture or upload images
* Convert input to grayscale pixel data (28×28)
* Send it to the backend for classification

---

## 🪪 License

MIT License — free to use and modify.

---
