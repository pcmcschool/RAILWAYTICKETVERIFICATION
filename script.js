// Initialize variables
const webcam = document.getElementById("webcam");
const statusText = document.getElementById("status");
const resultText = document.getElementById("result");
const idInput = document.getElementById("idInput");

// Load Teachable Machine model
let model;
(async () => {
  statusText.innerText = "Loading model...";
  model = await tmImage.load('model_path/model.json', 'model_path/metadata.json'); // Replace with your model path
  statusText.innerText = "Model loaded. Ready!";
})();

// Start webcam
async function setupWebcam() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  webcam.srcObject = stream;
}

// Start face verification
document.getElementById("start").addEventListener("click", async () => {
  await setupWebcam();
  statusText.innerText = "Analyzing face...";
  
  setInterval(async () => {
    const prediction = await model.predict(webcam);
    const recognized = prediction.some(p => p.probability > 0.8); // Adjust threshold
    if (recognized) {
      statusText.innerText = "Face recognized! Please enter your ID.";
    } else {
      statusText.innerText = "Face not recognized. Try again.";
    }
  }, 1000);
});

// Verify ID
document.getElementById("verify").addEventListener("click", () => {
  const inputId = idInput.value.trim();
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
});
