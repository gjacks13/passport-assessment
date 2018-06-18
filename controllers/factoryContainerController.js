const FactoryContainerNode = require('../models/factoryContainerNode');

module.exports = {
  getContainers(req, res) {
    const filter = {};
    const { name } = req.body;
    const { containerId } = req.params;
    if (name) {
      filter.name = name;
    }
    if (containerId) {
      filter._id = containerId;
    }

    FactoryContainerNode.find(filter)
      .populate({
        path: 'children',
        populate: {
          path: 'children',
          model: 'FactoryChildNode',
        },
      })
      .then((dbFactoryContainers) => {
        res.json(dbFactoryContainers);
      })
      .catch(err => res.json(err));
  },

  getContainer(req, res) {
    const filter = {};
    const { name } = req.body;
    const { containerId } = req.params;
    if (name) {
      filter.name = name;
    }
    if (containerId) {
      filter._id = containerId;
    }

    FactoryContainerNode.findOne(filter)
      .populate({
        path: 'children',
        populate: {
          path: 'children',
          model: 'FactoryChildNode',
        },
      })
      .then((dbFactoryContainers) => {
        res.json(dbFactoryContainers);
      })
      .catch(err => res.json(err));
  },

  updateContainer(req, res) {
    // parse the request body to prevent any extra data being sent to the database
    const filter = {};
    const { name, children } = req.body;
    const { containerId } = req.params;
    const request = { name };
    if (children) {
      request.children = children;
    }

    if (containerId) {
      filter._id = containerId;
    }

    FactoryContainerNode.findOneAndUpdate(filter, request, { new: true })
      .populate({
        path: 'children',
        populate: {
          path: 'children',
          model: 'FactoryChildNode',
        },
      })
      .then((dbFactoryContainer) => {
        res.json(dbFactoryContainer);
      })
      .catch(err => res.json(err));
  },

  createContainer(req, res) {
    const { name } = req.body;
    const newContainer = new FactoryContainerNode({
      name,
    });
    FactoryContainerNode.create(newContainer)
      .then((dbFactoryContainer) => {
        res.json(dbFactoryContainer);
      })
      .catch(err => res.json(err));
  },
};
