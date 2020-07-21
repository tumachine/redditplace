const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return [r, g, b];
};

const defaultColors = [
  0xFFFFFFFF,
  0xFFE4E4E4,
  0xFF888888,
  0xFF222222,
  0xFFD1A7FF,
  0xFF0000E5,
  0xFF0095E5,
  0xFF426AA0,
  0xFF00D9E5,
  0xFF44E094,
  0xFF01BE02,
  0xFFF0E500,
  0xFFC78300,
  0xFFEA0000,
  0xFFFF4AE0,
  0xFF800082,
];

export { hexToRgb };
