import axios from 'axios';

// const baseUrl = '/api/place';
const baseUrl = 'http://localhost:3001/api/places';

interface IPixel {
  id?: string,
  x: number,
  y: number,
  color: number,
  place?: string,
}

interface IPlace {
  id?: string,
  name: string,
  colors: string[],
  width: number,
  height: number,
  pixels?: IPixel[],
  url?: string,
}

const getPlaces = async (): Promise<IPlace[]> => {
  const places = await axios.get(baseUrl);
  return places.data;
}

const getPlace = async (placeName: string): Promise<IPlace> => {
  const place = await axios.get(`${baseUrl}/${placeName}`);
  return place.data;
}

const getPixels = async (placeName: string): Promise<IPixel[]> => {
  const pixels = await axios.get(`${baseUrl}/${placeName}/pixels`);
  return pixels.data;
}

const getPixel = async (placeName: string, x: number, y: number): Promise<IPixel> => {
  const pixel = await axios.get(`${baseUrl}/${placeName}/pixels?x=${x}&y=${y}`);
  return pixel.data;
}

const postPlace = async (placeName: string, width: number, height: number, colors: string[]): Promise<IPlace> => {
  const requestPlace: IPlace = {
    name: placeName,
    width,
    height,
    colors,
  } 
  const result = await axios.post<IPlace>(baseUrl, requestPlace);
  return result.data;
}

const deletePlace = async (placeName: string): Promise<IPlace> => {
  const result = await axios.delete(`${baseUrl}/${placeName}`);
  return result.data;
}

const postPixel = async (placeName: string, x: number, y: number, color: number): Promise<IPixel> => {
  const requestPixel: IPixel = {
    x,
    y,
    color,
  } 
  const result = await axios.post<IPixel>(`${baseUrl}/${placeName}`, requestPixel);
  return result.data;
}

const places = {
  getPlaces,
  getPlace,
  getPixels,
  getPixel,
  postPlace,
  deletePlace,
  postPixel,
}


export { places, IPixel, IPlace };
