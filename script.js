// Initialize variables
const webcam = document.getElementById("webcam");
const statusText = document.getElementById("status");
const resultText = document.getElementById("result");
const idInput = document.getElementById("idInput");

let model, webcamStream;

// Load the Teachable Machine model
async function loadModel() {
  statusText.innerText = "Loading model...";
  model = await tmImage.load('model/model.json', 'model/metadata.json');
  statusText.innerText = "Model loaded. Ready to start!";
}

// Start the webcam
async function setupWebcam() {
  webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
  webcam.srcObject = webcamStream;
  await new Promise((resolve) => (webcam.onloadedmetadata = resolve));
}

// Start face detection
async function startFaceDetection() {
  if (!model) {
    await loadModel();
  }
  await setupWebcam();

  statusText.innerText = "Analyzing face...";
  const interval = setInterval(async () => {
    const prediction = await model.predict(webcam);
    const recognized = prediction[0].probability > 0.8; // Adjust threshold if needed

    if (recognized) {
      clearInterval(interval);
      statusText.innerText = "Face recognized! Please enter your ID.";
    } else {
      statusText.innerText = "Face not recognized. Please try again.";
    }
  }, 1000);
}

// Verify ID
async function verifyID() {
  const inputId = idInput.value.trim();
  if (!inputId) {
    resultText.innerText = "Please enter an ID.";
    resultText.style.color = "red";
    return;
  }

  fetch('valid_ids.json') // Fetch ID database
    .then(response => response.json())
    .then(data => {
      const validIds = data.valid_ids;
      if (validIds.includes(inputId)) {
        resultText.innerText = "Access Granted!";
        resultText.style.color = "green";
      } else {
        resultText.innerText = "Access Denied!";
        resultText.style.color = "red";
      }
    });
}

// Attach event listeners
document.getElementById("start").addEventListener("click", startFaceDetection);
document.getElementById("verify").addEventListener("click", verifyID);
