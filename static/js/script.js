const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const processed = document.getElementById('processed');
const context = canvas.getContext('2d');

async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        video.addEventListener('play', () => {
            captureFrames();
        });
    } catch (error) {
        console.error('Error accessing the webcam: ', error);
    }
}

async function captureFrames() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');

    const response = await fetch('/process_frame', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData })
    });

    if (response.ok) {
        const result = await response.json();
        processed.src = `data:image/jpeg;base64,${result.image}`;
    } else {
        console.error('Failed to process frame:', await response.json());
    }

    requestAnimationFrame(captureFrames);
}

startVideo();
