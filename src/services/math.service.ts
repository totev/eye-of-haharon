import { Scale } from '@/components/provider/scale';
import { BoundingBox } from '@/components/provider/shapes/bounding-box';
import { ImageWrapper } from '@/components/provider/shapes/image-wrapper';
import { Rectangle } from '@/components/provider/shapes/rectangle';

const calculateScaleDimensions = (
  img: ImageWrapper,
  maxWidth: number = -1,
): Scale => {
  const scaled = new Scale();
  scaled.ratio = img.width / img.height;
  scaled.width = img.width;
  scaled.height = img.height;
  scaled.originalWidth = img.width;
  scaled.originalHeight = img.height;

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

const getMatchFromClickOnBoundingBox = (
  clickX: number,
  clickY: number,
  matches: Rectangle[],
): Rectangle => {
  let lum = matches.find((it: Rectangle) => {
    const isInX = it.x <= clickX && clickX <= it.w + it.x;
    const isInY = it.y < clickY && clickY < it.h + it.y;
    return isInX && isInY;
  });
  if (!lum) {
    lum = new Rectangle();
  }
  return lum;
};

const boundingBoxToRect = (image: ImageWrapper, bBox: BoundingBox) => {
  const rectangle = new Rectangle();
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

export { getMatchFromClickOnBoundingBox, boundingBoxToRect, calculateScaleDimensions };

