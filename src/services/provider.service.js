import client from 'api-client';
import flatMap from 'lodash/fp/flatMap';
import flow from 'lodash/fp/flow';
import get from 'lodash/fp/get';
import map from 'lodash/fp/map';
import { GenericProvider } from '../components/provider/GenericProvider';
import { boundingBoxToRect } from './math.service';

const allProviders = () => {
  const azure = new GenericProvider(
    'https://westeurope.api.cognitive.microsoft.com/vision/v2.0/detect',
    {
      type: 'Header',
      title: 'Ocp-Apim-Subscription-Key',
      label: 'Subscription key',
    },
    'azure',
    'Azure cognitive vision'
  );
  const aws = new GenericProvider(
    'https://westeurope.api.cognitive.microsoft.com/vision/v2.0/detect',
    {
      type: 'Header',
      title: 'Ocp-Apim-Subscription-Key',
      label: 'Subscription key',
    },
    'aws',
    'AWS Rekognition'
  );
  return [azure, aws];
};

const loadResultForService = async function(serviceName) {
  let response;
  switch (serviceName) {
    case 'aws':
      response = client.fetchAWS();
      break;
    case 'azure':
      response = client.fetchAzure();
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

const transformMatchesToRectangles = async function(
  serviceSource,
  image,
  matches
) {
  matches = matches || (await loadResultForService(serviceSource));

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

export { loadResultForService, transformMatchesToRectangles, transformAWSMatchesToRectangles, transformAzureMatchesToRectangles, allProviders, };

