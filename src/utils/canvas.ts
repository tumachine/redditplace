import {places, IPixel, IPlace} from '../services/board';
import { hexToRgb } from './utils';

interface Vector {
  x: number;
  y: number;
}

class Canvas {
  canvas: HTMLCanvasElement;

  context: CanvasRenderingContext2D;

  backCanvas: HTMLCanvasElement;

  backContext: CanvasRenderingContext2D;

  mouseDown: boolean = false;

  image: HTMLImageElement;

  scale: number = 1.0;

  scaleMultiplier: number = 0.8;

  startDragOffset: Vector = { x: 0, y: 0 };

  translatePos: Vector = { x: 0, y: 0 };

  rgbColors: number[][];

  onPlacingPixel: (x: number, y: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.context.imageSmoothingEnabled = false;

    this.backCanvas = document.createElement('canvas');
    this.backContext = this.backCanvas.getContext('2d');
    this.backContext.imageSmoothingEnabled = false;

    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('wheel', this.handleZoom);

    window.addEventListener('resize', this.resizeCanvas, false);
    this.resizeCanvas();

    this.translatePos = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    }; 
  }

  redraw = () => {
    console.log('redrawing');

    this.context.fillStyle = '#9e9e9e';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.save();
    this.context.translate(this.translatePos.x, this.translatePos.y);
    this.context.scale(this.scale, this.scale);
    this.context.drawImage(this.image, 0, 0)
    this.context.restore();
  }

  setPlace = (link: string, colors: string[]) => {
    this.setRgbColors(colors);

    const image = new Image();
    image.onload = () => {
      this.backCanvas.width = image.width;
      this.backCanvas.height = image.height;
      this.backContext.drawImage(image, 0, 0);

      const secondImage = new Image();
      secondImage.onload = () => {
        this.image = new Image();
        this.image.src = secondImage.src;
        this.redraw();
      }
      secondImage.src = this.backCanvas.toDataURL('image/png');
    }
    image.src = link;
    image.crossOrigin = 'Anonymous';
  }

  doImageDataOperation = (func: (imageData: ImageData) => void) => {
    const t0 = performance.now();
    const imageData = this.backContext.getImageData(0, 0, this.backCanvas.width, this.backCanvas.height);

    func(imageData);

    this.backContext.putImageData(imageData, 0, 0);

    const image = new Image();
    image.onload = () => {
      this.image.src = image.src;
      this.redraw();
    }
    image.src = this.backCanvas.toDataURL();

    const t1 = performance.now();
    console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
  }

  drawPixel = (imageData: ImageData, pixel: IPixel) => {
    const position = (pixel.y * this.image.width + pixel.x) * 4
    imageData.data[position] = this.rgbColors[pixel.color][0];
    imageData.data[position+1] = this.rgbColors[pixel.color][1];
    imageData.data[position+2] = this.rgbColors[pixel.color][2];
  }

  placePixels = (pixels: IPixel[]) => {
    this.doImageDataOperation((imageData) => {
      for (let i = 0; i < pixels.length; i += 1) {
        this.drawPixel(imageData, pixels[i]);
      }
    })
  }

  placePixel = (pixel: IPixel) => {
    this.doImageDataOperation((imageData) => {
      this.drawPixel(imageData, pixel);
    })
  }

  setRgbColors = (colors: string[]) => {
    this.rgbColors = [];
    for (let i = 0; i < colors.length; i += 1) {
      this.rgbColors.push(hexToRgb(colors[i]));
    }
  }

  handleMouseDown = (e: MouseEvent) => {
    this.mouseDown = true;

    console.log('mouse is down')

    this.startDragOffset.x = e.clientX - this.translatePos.x;
    this.startDragOffset.y = e.clientY - this.translatePos.y;
    if (this.imageClicked(e)) {
      const pos = this.getPixel(e);
      this.onPlacingPixel(pos.x, pos.y);
      // console.log(pos);
    }
  }

  getPixel = (e: MouseEvent): Vector => {
    const x = Math.floor((e.clientX - this.translatePos.x) / this.scale);
    const y = Math.floor((e.clientY - this.translatePos.y) / this.scale);
    return { x, y };
  }

  imageClicked = (e: MouseEvent) => {
    const x = e.clientX - this.translatePos.x;
    const y = e.clientY - this.translatePos.y;

    const imgW = this.scale * this.image.width;
    const imgH = this.scale * this.image.height;

    if (x >= 0 && x <= imgW && y >= 0 && y <= imgH) {
      return true;
    }
    return false;
  }

  handleZoom = (e: WheelEvent) => {
    const xs = (e.clientX - this.translatePos.x) / this.scale;
    const ys = (e.clientY - this.translatePos.y) / this.scale;

    if (e.deltaY > 0) {
      this.scale *= this.scaleMultiplier;
    } else {
      this.scale /= this.scaleMultiplier;
    }

    this.translatePos.x = e.clientX - xs * this.scale;
    this.translatePos.y = e.clientY - ys * this.scale;
    this.redraw();
  }

  handleMouseUp = (e: MouseEvent) => {
    this.mouseDown = false;
  }

  handleMouseMove = (e: MouseEvent) => {
    if (this.mouseDown) {
      this.translatePos.x = e.clientX - this.startDragOffset.x;
      this.translatePos.y = e.clientY - this.startDragOffset.y;

      this.redraw();
    }
  }

  resizeCanvas = () => {
    // this.canvas.width = window.innerWidth;
    // this.canvas.height = window.innerHeight;
    // this.canvas.style.width = '100%';
    // this.canvas.style.height = '100%';
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.context.imageSmoothingEnabled = false;

    if (this.image) {
      this.redraw();
    }
  }


  dispose = () => {
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);

    window.removeEventListener('resize', this.resizeCanvas);
  }
}

export default Canvas;
