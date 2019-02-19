import { getMatchFromClickOnBoundingBox } from '@/services/math.service.js';
import { boundingBoxToRect } from '../../src/services/math.service';
describe('math.service.spec.js', () => {
  describe('getMatchFromClickOnBoundingBox', () => {
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
        getMatchFromClickOnBoundingBox(clickX, clickY, { objects: [match] })
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
        getMatchFromClickOnBoundingBox(clickX, clickY, { objects: [match] })
      ).toEqual(match);
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
