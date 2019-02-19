import { transformAWSMatchesToRectangles, transformAzureMatchesToRectangles } from '../../src/services/provider.service';

describe('provider.service', () => {
  describe('transformMatchesToRectangles', () => {
    it('can transform an azure match to a list of rects', () => {
      const azureMatches = {
        objects: [
          {
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
          },
          {
            rectangle: {
              x: 132,
              y: 8,
              w: 67,
              h: 45,
            },
            object: 'dormer window',
            confidence: 0.618,
            parent: {
              object: 'window',
              confidence: 0.653,
            },
          },
        ],
        metadata: {
          width: 1280,
          height: 260,
          format: 'Jpeg',
        },
      };

      const expected = [
        {
          x: 41,
          y: 5,
          w: 46,
          h: 39,
        },
        {
          x: 132,
          y: 8,
          w: 67,
          h: 45,
        },
      ];

      expect(transformAzureMatchesToRectangles(azureMatches)).toEqual(expected);
    });
    it('can transform an AWS match to a list of rects', () => {
      const awsMatches = {
        Labels: [
          {
            Confidence: 98.24288940429688,
            Instances: [],
            Name: 'Automobile',
            Parents: [{ Name: 'Transportation' }, { Name: 'Vehicle' }],
          },
          {
            Confidence: 98.24288940429688,
            Instances: [
              {
                BoundingBox: {
                  Height: 0.4367696940898895,
                  Left: 0.5198802351951599,
                  Top: 0.4165303707122803,
                  Width: 0.15560778975486755,
                },
                Confidence: 97.35424041748047,
              },
              {
                BoundingBox: {
                  Height: 0.48046112060546875,
                  Left: 0.5288015007972717,
                  Top: 0.4543455243110657,
                  Width: 0.23288841545581818,
                },
                Confidence: 89.15740203857422,
              }
            ],
            Name: 'Car',
            Parents: [{ Name: 'Transportation' }, { Name: 'Vehicle' }],
          },
        ],
      };

      const image = { width: 1280, height: 260 };
      const expected = [
        {
          x: 665,
          y: 108,
          w: 199,
          h: 114,
        },
        {
          x: 677,
          y: 118,
          w: 298,
          h: 125,
        },
      ];

      expect(transformAWSMatchesToRectangles(image, awsMatches)).toEqual(
        expected
      );
    });
  });
});
