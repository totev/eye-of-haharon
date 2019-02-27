const calculateScaleDimensions = (img, maxWidth) => {
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
  /* do not scale height, becase a scroll context takes care of consistent vertical size
  if (scaled.height > maxHeight) {
    scaled.height = maxHeight;
    scaled.width = scaled.height / scaled.ratio;
  }
  */
  return scaled;
};

const getMatchFromClickOnBoundingBox = (clickX, clickY, matches) => {
  const lum = matches.find(it => {
    const isInX =
      it.x <= clickX && clickX <= it.w + it.x;
    const isInY =
      it.y < clickY && clickY < it.h + it.y;

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

