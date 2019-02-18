import { isInBoundingBox } from "@/services/math.service.js";
describe('math.service.spec.js', () => {
  describe('isInBoundingBox', () => {
    it('not in bounding box', () => {
      const match = {
        rectangle: {
          x: 41,
          y: 5,
          w: 46,
          h: 39,
        },
        object: 'dormer window',
        confidence: 0.573,
        parent: {
          object: 'window',
          confidence: 0.61,
        },
      };
      const clickX = 111,
        clickY = 222;

      expect(
        isInBoundingBox(clickX, clickY, { objects: [match] })
      ).toBeUndefined();
    });

    it('in bounding box', () => {
      const match = {
        rectangle: {
          x: 62,
          y: 5,
          w: 46,
          h: 39,
        },
        object: 'dormer window',
        confidence: 0.573,
        parent: {
          object: 'window',
          confidence: 0.61,
        },
      };
      const clickX = 101,
        clickY = 40;

      expect(
        isInBoundingBox(clickX, clickY, { objects: [match] })
      ).toEqual(match);
    });
  });
});
