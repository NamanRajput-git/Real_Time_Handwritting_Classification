const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "white";
ctx.lineWidth = 15;

let drawing = false;

canvas.addEventListener("mousedown", () => (drawing = true));
canvas.addEventListener("mouseup", () => (drawing = false));
canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function clearCanvas() {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Webcam setup
const video = document.getElementById("video");
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
});

let capturedImage = null;
function captureWebcam() {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 28;
  tempCanvas.height = 28;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(video, 0, 0, 28, 28);
  capturedImage = tempCtx.getImageData(0, 0, 28, 28);
  alert("Webcam image captured!");
}

// Gallery upload
let uploadedImage = null;
const uploadInput = document.getElementById("upload");
uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 28;
      tempCanvas.height = 28;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.drawImage(img, 0, 0, 28, 28);
      uploadedImage = tempCtx.getImageData(0, 0, 28, 28);
      alert("Image uploaded!");
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Convert ImageData to 784-length grayscale array
function imageDataToArray(imageData) {
  const arr = [];
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    // grayscale = (R+G+B)/3, invert color
    arr.push((255 - (data[i] + data[i + 1] + data[i + 2]) / 3) / 255.0);
  }
  return arr;
}

// Get array from canvas
function canvasToArray() {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 28;
  tempCanvas.height = 28;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(canvas, 0, 0, 28, 28);
  const imageData = tempCtx.getImageData(0, 0, 28, 28);
  return imageDataToArray(imageData);
}

// Predict function
async function predict() {
  let pixels = null;
  if (uploadedImage) pixels = imageDataToArray(uploadedImage);
  else if (capturedImage) pixels = imageDataToArray(capturedImage);
  else pixels = canvasToArray();
  try {
    const res = await fetch(
      "https://huggingface.co/spaces/<username>/<space-name>/api/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pixels: pixels }),
      }
    );
    const data = await res.json();
  } catch (e) {
    console.log(e);
    alert("Something went wrong! Please try again.");
  }
  document.getElementById("result").innerText =
    "Prediction: " + data.prediction;
}
