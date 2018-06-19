import axios from 'axios';

export default {
  getContainers() {
    return axios.get('/api/container');
  },

  getContainer(containerId) {
    return axios.get(`/api/container/${containerId}`);
  },

  addFactory(containerId, factoryName, minChildValue, maxChildValue) {
    const requestBody = {
      name: factoryName,
      minChildValue,
      maxChildValue,
    };
    return axios.post(`/api/container/${containerId}/factory`, requestBody);
  },

  updateFactory(containerId, factoryId, requestBody) {
    return axios.put(`/api/container/${containerId}/factory/${factoryId}`, requestBody);
  },

  deleteFactory(containerId, factoryId) {
    return axios.delete(`/api/container/${containerId}/factory/${factoryId}`);
  },

  addNodes(containerId, factoryId, minValue, maxValue, nodeValues) {
    const request = {
      minValue,
      maxValue,
      nodeValues,
    };
    return axios.post(`/api/container/${containerId}/factory/${factoryId}/node`, request);
  },

  deleteNodes(containerId, factoryId) {
    return axios.delete(`/api/container/${containerId}/factory/${factoryId}/node`);
  },
};
