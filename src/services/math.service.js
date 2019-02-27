const calculateScaleDimensions = (img, maxWidth, maxHeight) => {
  const scaled = {
    ratio: img.width / img.height,
    originalWidth: img.width,
    originalHeight: img.height,
    width: img.width,
    height: img.height,
  };
  if (scaled.width > maxWidth) {
    scaled.width = maxWidth;
    scaled.height = scaled.width / scaled.ratio;
  }
  if (scaled.height > maxHeight) {
    scaled.height = maxHeight;
    scaled.width = scaled.height / scaled.ratio;
  }
  return scaled;
};

const getMatchFromClickOnBoundingBox = (clickX, clickY, matches) => {
  const lum = matches.objects.find(it => {
    const isInX =
      it.rectangle.x <= clickX && clickX <= it.rectangle.w + it.rectangle.x;
    const isInY =
      it.rectangle.y < clickY && clickY < it.rectangle.h + it.rectangle.y;

    return isInX && isInY;
  });
  return lum;
};

const boundingBoxToRect = (image, bBox) => {
  const rectangle = {};
  const scale = 1;
  const height = image.height;
  const width = image.width;
  const left = width * bBox.Left;
  const top = height * bBox.Top;
  rectangle.x = Math.round(left / scale);
  rectangle.y = Math.round(top / scale);
  rectangle.w = Math.round((width * bBox.Width) / scale);
  rectangle.h = Math.round((height * bBox.Height) / scale);
  return rectangle;
};

export { getMatchFromClickOnBoundingBox, boundingBoxToRect, calculateScaleDimensions, };

