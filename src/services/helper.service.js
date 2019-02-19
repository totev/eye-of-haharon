const readFile = function(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = ({ ev }) => {
      reject(ev);
    };
    reader.readAsDataURL(file);
  });
};

const loadImage = function(imageData) {
  return new Promise(resolve => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img), false);
    img.src = imageData;
  });
};

export { loadImage, readFile };

