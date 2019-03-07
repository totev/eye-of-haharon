const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (ev) => {
      reject(ev);
    };
    reader.readAsDataURL(file);
  });
};

const loadImage = (imageData: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img), false);
    img.src = imageData;
  });
};

const isImageEmpty = (img: ImageData): boolean => {
  return img instanceof ImageData && img.width > 0 && img.height > 0;
};

export { loadImage, readFile, isImageEmpty };

