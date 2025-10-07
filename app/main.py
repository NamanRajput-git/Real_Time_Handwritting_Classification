from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from tensorflow import keras

app = FastAPI()

# Load model
model = keras.models.load_model("best_model.h5")

# Input schema
class InputData(BaseModel):
    pixels: list  # flattened 28x28 = 784 values

@app.post("/predict")
def predict(data: InputData):

    X = np.array(data.pixels).reshape(1, 28, 28, 1) / 255.0  # normalize if trained that way
    y_pred = model.predict(X)
    predicted_class = int(np.argmax(y_pred, axis=1)[0])
    return {"prediction": predicted_class}
