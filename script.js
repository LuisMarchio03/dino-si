let previousY = null;
const thresholdJump = 20;   // Aumentei a sensibilidade para o pulo
const thresholdCrouch = 20; // Aumentei a sensibilidade para o agachamento
let cooldown = false;       // Cooldown para evitar múltiplas detecções rápidas

async function setupCamera() {
  const video = document.getElementById('video');
  const stream = await navigator.mediaDevices.getUserMedia({ 
    video: { width: 320, height: 240 }  // Definindo uma resolução menor
  });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => resolve(video);
  });
}


async function detectPose() {
  const net = await posenet.load({
    architecture: 'MobileNetV1',  // Um modelo mais leve
    outputStride: 16,             // Valor mais baixo aumenta a velocidade
    inputResolution: { width: 320, height: 240 },  // Resolução mais baixa para processar mais rápido
    multiplier: 0.5               // Reduz a precisão para aumentar a velocidade
  });

  const video = document.getElementById('video');
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  while (true) {
    const pose = await net.estimateSinglePose(video, { flipHorizontal: false });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (!cooldown) {
      detectJumpOrCrouch(pose);
    }
    drawPose(pose, ctx);

    await tf.nextFrame();  // Chama o próximo frame para processamento
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

  if (previousY !== null) {
    const deltaY = previousY - avgHipY;

    if (deltaY > thresholdJump) {
      triggerJump();  // Simular pulo
      activateCooldown();  // Prevenir múltiplas detecções
    } else if (deltaY < -thresholdCrouch) {
      triggerCrouch();  // Simular agachamento
      activateCooldown();  // Prevenir múltiplas detecções
    }
  }

  previousY = avgHipY;
}

// Cooldown para evitar múltiplas detecções seguidas
function activateCooldown() {
  cooldown = true;
  setTimeout(() => cooldown = false, 300);  // Reduzido de 1 segundo para 300ms
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
