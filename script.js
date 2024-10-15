let previousY = null;
const thresholdJump = 10;   // Sensibilidade para pular
const thresholdCrouch = 10; // Sensibilidade para agachar

async function setupCamera() {
  const video = document.getElementById('video');
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => resolve(video);
  });
}

async function detectPose() {
  const net = await posenet.load();
  const video = document.getElementById('video');
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  while (true) {
    const pose = await net.estimateSinglePose(video, { flipHorizontal: false });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    detectJumpOrCrouch(pose);
    drawPose(pose, ctx);

    await tf.nextFrame();
  }
}

function drawPose(pose, ctx) {
  pose.keypoints.forEach((keypoint) => {
    if (keypoint.score > 0.5) {
      ctx.beginPath();
      ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    }
  });
}

// Função para detectar movimentos de pulo ou agachamento
function detectJumpOrCrouch(pose) {
  const keypoints = pose.keypoints;
  const leftHip = keypoints.find(point => point.part === 'leftHip');
  const rightHip = keypoints.find(point => point.part === 'rightHip');
  const avgHipY = (leftHip.position.y + rightHip.position.y) / 2;

  if (previousY) {
    const deltaY = previousY - avgHipY;

    if (deltaY > thresholdJump) {
      triggerJump();  // Simular pulo
    } else if (deltaY < -thresholdCrouch) {
      triggerCrouch();  // Simular agachamento
    }
  }

  previousY = avgHipY;
}

// Funções para simular o controle do Dino via teclas
function triggerJump() {
  console.log('Jump Detected!');
  const dinoFrame = document.getElementById('dinoGame').contentWindow;
  dinoFrame.document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 })); // Simular barra de espaço
}

function triggerCrouch() {
  console.log('Crouch Detected!');
  const dinoFrame = document.getElementById('dinoGame').contentWindow;
  dinoFrame.document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 40 })); // Simular seta para baixo
}

// Iniciar a câmera e detecção de movimentos
setupCamera().then(detectPose);
