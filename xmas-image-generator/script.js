const video = document.getElementById('video');
const snap = document.getElementById('snap');
const canvas = document.getElementById('canvas');
const imageContainer = document.getElementById('image-container');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing camera:', err);
    }
}

startCamera();
