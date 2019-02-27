import { boundingBoxToRect, calculateScaleDimensions, getMatchFromClickOnBoundingBox } from '@/services/math.service.js';
describe('math.service.spec.js', () => {
  describe('calculateScaleDimensions', () => {
    it('should calculate scale correctly', () => {
      const img = { width: 1280, height: 260 };
      const newWidth = 1105;
      const newHeight = 203;
      const result = calculateScaleDimensions(img, newWidth, newHeight);

      expect(result.originalWidth).toBe(img.width);
      expect(result.originalHeight).toBe(img.height);

      expect(result.width / result.height).toEqual(result.ratio);
      expect(result.width).toBe(newWidth);
    });
  });

  describe('getMatchFromClickOnBoundingBox', () => {
    it('not in bounding box', () => {
      const match = {
        x: 41,
        y: 5,
        w: 46,
        h: 39,
      };
      const clickX = 111,
        clickY = 222;

      expect(
        getMatchFromClickOnBoundingBox(clickX, clickY, [match])
      ).toBeUndefined();
    });

    it('in bounding box', () => {
      const match = {
        x: 62,
        y: 5,
        w: 46,
        h: 39,
      };
      const clickX = 101,
        clickY = 40;

      expect(getMatchFromClickOnBoundingBox(clickX, clickY, [match])).toEqual(
        match
      );
    });
  });

  describe('boundingBoxToRect', () => {
    it('can transform from bounding box to a rectangle', () => {
      const bBox = {
        Height: 0.2930403,
        Left: 0.3922065,
        Top: 0.15567766,
        Width: 0.284666,
      };

      const expected = {
        x: 238,
        y: 92,
        w: 173,
        h: 172,
      };

      expect(boundingBoxToRect({ width: 608, height: 588 }, bBox)).toEqual(
        expected
      );
    });
  });
});
