import mockedAWS from './data/aws.json';
import mockedAzure from './data/azure.json';
import mockedGoogle from './data/google.json';

const fetch = (mockData: any, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, time);
  });
};

export default {
  fetchAWS() {
    return fetch(mockedAWS, 1000); // wait 1s before returning found matches
  },
  fetchAzure() {
    return fetch(mockedAzure, 1000); // wait 1s before returning found matches
  },
  fetchGoogle() {
    return fetch(mockedGoogle, 1000); // wait 1s before returning found matches
  },
};
