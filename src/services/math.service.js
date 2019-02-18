const isInBoundingBox = (clickX, clickY, matches) => {
  const lum = matches.objects.find(it => {
    const isInX =
      it.rectangle.x <= clickX && clickX <= it.rectangle.w + it.rectangle.x;
    const isInY =
      it.rectangle.y < clickY && clickY < it.rectangle.h + it.rectangle.y;

    return isInX && isInY;
  });
  return lum;
};

export { isInBoundingBox };

