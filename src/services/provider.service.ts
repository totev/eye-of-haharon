import { AWSProviderResult } from '@/components/provider/aws-result';
import { AzureResult } from '@/components/provider/azure-result';
import { AzureResultObject } from '@/components/provider/AzureResultObject';
import { CloudProvider, GenericProvider } from '@/components/provider/generic-provider';
import { Scale } from '@/components/provider/scale';
import { Rectangle } from '@/components/provider/shapes/rectangle';
import client from 'api-client';
import flatMap from 'lodash/fp/flatMap';
import flow from 'lodash/fp/flow';
import get from 'lodash/fp/get';
import map from 'lodash/fp/map';
import has from 'lodash/has';
import { boundingBoxToRect } from './math.service';

const allProviders = () => {
  const azure = new GenericProvider(
    new URL(
      'https://westeurope.api.cognitive.microsoft.com/vision/v2.0/detect',
    ),
    {
      type: 'Header',
      title: 'Ocp-Apim-Subscription-Key',
      label: 'Subscription key',
    },
    'azure',
    'Azure cognitive vision',
  );
  const aws = new GenericProvider(
    new URL(
      'https://westeurope.api.cognitive.microsoft.com/vision/v2.0/detect',
    ),
    {
      type: 'Header',
      title: 'Ocp-Apim-Subscription-Key',
      label: 'Subscription key',
    },
    'aws',
    'AWS Rekognition',
  );
  return [azure, aws];
};

const loadResultForService = async (
  serviceName: CloudProvider,
): Promise<AzureResult | AWSProviderResult> => {
  let response;
  switch (serviceName) {
    case 'aws':
      response = client.fetchAWS();
      break;
    case 'azure':
      response = client.fetchAzure();
      break;
    default:
      response = Promise.reject();
      break;
  }
  return response;
};

/**
 * Azure already provides the right format in the objects array.
 * @param {*} matches
 */
const transformAzureMatchesToRectangles = (
  matches: AzureResult,
): Rectangle[] => {
  return flow(
    get('objects'),
    map((it: AzureResultObject) => it.rectangle as Rectangle),
  )(matches);
};

const transformAWSMatchesToRectangles = (
  image: ImageData,
  matches: AWSProviderResult,
) => {
  return flow(
    get('Labels'),
    flatMap('Instances'),
    map('BoundingBox'),
    map((bbox) => boundingBoxToRect(image, bbox)),
  )(matches);
};

const collectAndTransformMatchesToRectangles = async (
  serviceSource: CloudProvider,
  image: ImageData,
): Promise<Rectangle[]> => {
  const matches = await loadResultForService(serviceSource);
  return transformMatchesToRectangles(serviceSource, image, matches);
};

const transformMatchesToRectangles = (
  serviceSource: CloudProvider,
  image: ImageData,
  matches: AzureResult | AWSProviderResult,
): Rectangle[] => {
  let response: Rectangle[] = [];
  switch (serviceSource) {
    case 'azure':
      response = transformAzureMatchesToRectangles(matches as AzureResult);
      break;
    case 'aws':
      response = transformAWSMatchesToRectangles(image, matches);
      break;
    default:
      response = [];
      break;
  }

  if (!response) {
    response = [];
  }

  return response;
};

const scaleRectangles = (rects: Rectangle[], scale: Scale) => {
  if (!scale || !has(scale, 'width') || !has(scale, 'height')) {
    return rects;
  }
  const diffX = scale.originalWidth / scale.width;
  const diffY = scale.originalHeight / scale.height;

  return rects.map((match) => {
    return {
      w: match.w / diffX,
      h: match.h / diffY,
      x: match.x / diffX,
      y: match.y / diffY,
    };
  });
};

export { loadResultForService, collectAndTransformMatchesToRectangles, transformMatchesToRectangles, transformAWSMatchesToRectangles, transformAzureMatchesToRectangles, allProviders, scaleRectangles, };

