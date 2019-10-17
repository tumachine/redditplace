import {connect, sendMsg} from './modules/ws.mjs';

connect((msg) => {
  // const messages = document.getElementById('messages');
  // messages.innerHTML += msg.data;

  let pixel = JSON.parse(msg.data).body;
  pixel = JSON.parse(pixel);
  console.log('PIXEL: ', pixel);

  placePixel(pixel['x'], pixel['y'], pixel['color']);
  console.log('Received pixel:');
  console.log(pixel['x'], pixel['y'], pixel['color']);
  drawPlace();
});


// canvas operations
const canvas = document.getElementById('placeCanvas');

const ctx = canvas.getContext('2d');

canvas.onmousedown = function(e) {
  // const rect = canvas.getBoundingClientRect();

  const rect = canvas.getBoundingClientRect();
  const scaleX = rect.width / 100;
  const scaleY = rect.height / 100;

  console.log('SCALE: ', scaleX);
  let mouseX = e.clientX - rect.left;
  let mouseY = e.clientY - rect.top;
  console.log('Mouse X: ', mouseX);
  console.log('Mouse Y: ', mouseY);

  mouseX = Math.floor(mouseX / scaleX);
  mouseY = Math.floor(mouseY / scaleY);

  const dataToSend = JSON.stringify({'x': mouseX, 'y': mouseY, 'color': currentColor});
  fetch('http://localhost:8080/api/place/draw', {credentials: 'same-origin', mode: 'same-origin', method: 'post', body: dataToSend})
      .then((resp) => {
        if (resp.status==200) {
          return resp.json();
        } else {
          console.log('Status: '+resp.status);
        }
      });
};

const colorMap = new Map();
colorMap.set(0, 0xFFFFFFFF);
colorMap.set(1, 0xFFE4E4E4);
colorMap.set(2, 0xFF888888);
colorMap.set(3, 0xFF222222);
colorMap.set(4, 0xFFD1A7FF);
colorMap.set(5, 0xFF0000E5);
colorMap.set(6, 0xFF0095E5);
colorMap.set(7, 0xFF426AA0);
colorMap.set(8, 0xFF00D9E5);
colorMap.set(9, 0xFF44E094);
colorMap.set(10, 0xFF01BE02);
colorMap.set(11, 0xFFF0E500);
colorMap.set(12, 0xFFC78300);
colorMap.set(13, 0xFFEA0000);
colorMap.set(14, 0xFFFF4AE0);
colorMap.set(15, 0xFF800082);

// let currentColor = colorMap.get(0);
let currentColor = 0;
const colorButtons = document.getElementById('color-buttons');

// create reverse colors
function hexToRgb(hex) {
  const b = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const r = hex & 255;

  return 'rgb(' + r + ',' + g + ',' + b + ')';
}


// create color buttons
for (const [key, value] of colorMap) {
  const button = document.createElement('button');
  colorButtons.appendChild(button);
  button.style.backgroundColor = hexToRgb(value);
  button.style.width = '30px';
  button.style.height = '30px';
  button.addEventListener('click', function() {
    currentColor = key;
  });
}


// fetch binary data from api
(async () => {
  const response = await fetch('http://localhost:8080/api/place/board-bitmap');
  // buffer of bytes
  const buffer = await response.arrayBuffer();
  const colorsBuffer = convertResponseBufferToColorBuffer(buffer);

  fillCanvasWithBuffer(colorsBuffer);
  drawPlace(colorsBuffer);
})();

function convertResponseBufferToColorBuffer(buffer) {
  const array = new Uint8ClampedArray(buffer);
  console.log(buffer);


  // buffer for colors
  const colorsBuffer = new ArrayBuffer(10000);
  const canvasArray = new Uint8ClampedArray(colorsBuffer);

  for (let i = 0; i < 5000; i++) {
    const colorOne = array[i] >> 4;
    const colorTwo = array[i] & 0x0F;

    canvasArray[i*2] = colorOne;
    canvasArray[i*2+1] = colorTwo;
  }
  return colorsBuffer;
}

const canvasBuffer = new ArrayBuffer(40000);
const canvasArr = new Uint32Array(canvasBuffer);
const canvasU8 = new Uint8ClampedArray(canvasBuffer);

function fillCanvasWithBuffer(buffer) {
  const u8int = new Uint8ClampedArray(buffer);

  for (let i = 0; i < 10000; i++) {
    canvasArr[i] = colorMap.get(u8int[i]);
  }
}

function drawPlace() {
  const imageData = new ImageData(canvasU8, 100, 100);

  ctx.putImageData(imageData, 0, 0);
}

function placePixel(x, y, color) {
  canvasArr[x + 100*y] = colorMap.get(color);
}

const rangePlace = document.getElementById('rangePlace');

rangePlace.addEventListener('change', (e) => {
  canvas.style.width = rangePlace.value * 100 + 'px';
  canvas.style.height = rangePlace.value * 100 + 'px';
});
