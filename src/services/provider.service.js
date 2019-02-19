import { awsResponse } from '@/services/AWSRekognition.js';
import { match as azureResponse } from '@/services/Azure.js';
import flatMap from 'lodash/fp/flatMap';
import flow from 'lodash/fp/flow';
import get from 'lodash/fp/get';
import map from 'lodash/fp/map';
import { boundingBoxToRect } from './math.service';

const loadResultForService = serviceName => {
  let response;
  switch (serviceName) {
    case 'aws':
      response = awsResponse;
      break;
    case 'azure':
      response = azureResponse;
      break;
    default:
      break;
  }
  return response;
};

/**
 * Azure already provides the right format in the objects array.
 * @param {*} matches
 */
const transformAzureMatchesToRectangles = matches => {
  return matches.objects.map(it => it.rectangle);
};

const transformAWSMatchesToRectangles = (image, matches) => {
  return flow(
    get('Labels'),
    flatMap('Instances'),
    map('BoundingBox'),
    map(bbox => boundingBoxToRect(image, bbox))
  )(matches);
};

const transformMatchesToRectangles = (serviceSource, image, matches) => {
  matches = matches || loadResultForService(serviceSource);

  let response = [];
  switch (serviceSource) {
    case 'azure':
      response = transformAzureMatchesToRectangles(matches);
      break;
    case 'aws':
      response = transformAWSMatchesToRectangles(image, matches);
      break;
    default:
      break;
  }
  return response;
};

export { loadResultForService, transformMatchesToRectangles, transformAWSMatchesToRectangles, transformAzureMatchesToRectangles, };

