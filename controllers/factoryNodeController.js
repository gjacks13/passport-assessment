const FactoryNode = require('../models/factoryNode');
const FactoryChildNode = require('../models/factoryChildNode');
const FactoryContainerNode = require('../models/factoryContainerNode');

module.exports = {
  getFactories(req, res) {
    /* creating the filter const here isn't really necessary but it
     * makes it easier for someone else to extend filtering options
     * in the future.
     * */
    const filter = {};
    FactoryNode.find(filter)
      .populate({
        path: 'children',
        populate: {
          path: 'children',
          model: 'FactoryChildNode',
        },
      })
      .then((dbFactoryNodes) => {
        res.json(dbFactoryNodes);
      })
      .catch(err => res.json(err));
  },

  getFactory(req, res) {
    const filter = {};
    const { factoryId } = req.params;
    if (factoryId) {
      filter._id = factoryId;
    }

    FactoryNode.findOne(filter)
      .populate({
        path: 'children',
        populate: {
          path: 'children',
          model: 'FactoryChildNode',
        },
      })
      .then((dbFactoryNode) => {
        res.json(dbFactoryNode);
      })
      .catch(err => res.json(err));
  },

  updateFactory(req, res) {
    const request = {};
    const { factoryId } = req.params;
    const {
      name,
      children,
      minChildValue,
      maxChildValue,
    } = req.body;

    // setup filter by id
    const filter = {
      _id: factoryId,
    };

    // set request data
    if (name) request.name = name;
    if (children) request.children = children;
    if (minChildValue) request.minChildValue = minChildValue;
    if (maxChildValue) request.maxChildValue = maxChildValue;

    FactoryNode.findOneAndUpdate(filter, request, { new: true })
      .populate({
        path: 'children',
        populate: {
          path: 'children',
          model: 'FactoryChildNode',
        },
      })
      .then((dbFactoryNode) => {
        req.app.io.emit('update factory', dbFactoryNode);
        res.json(dbFactoryNode);
      })
      .catch(err => res.json(err));
  },

  createFactory(req, res) {
    const request = {};
    const { containerId } = req.params;
    const {
      name,
      children,
      minChildValue,
      maxChildValue,
    } = req.body;

    // set request data
    if (name) request.name = name;
    if (children) request.children = children;
    if (minChildValue) request.minChildValue = minChildValue;
    if (maxChildValue) request.maxChildValue = maxChildValue;
    if (!containerId) {
      res.status(500).json('No factory id present');
    }
    request.containerId = containerId;

    const newFactory = new FactoryNode(request);
    FactoryNode.create(newFactory)
      .then((dbFactoryNode) => {
        /* push this factory onto the factory container child array, for the
         * container specified in the route params
         * */
        FactoryContainerNode.findOneAndUpdate(
          { _id: containerId },
          { $push: { children: dbFactoryNode._id } },
          { new: true },
        )
          .then(() => {
            req.app.io.emit('add factory', dbFactoryNode);
            res.json(dbFactoryNode);
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  },

  deleteFactory(req, res) {
    const { factoryId } = req.params;
    const filter = {
      _id: factoryId,
    };
    FactoryNode.findOneAndRemove(filter)
      .then((dbFactoryNode) => {
        const { children } = dbFactoryNode;
        // delete all remaining child nodes
        children.forEach((childNode) => {
          FactoryChildNode.findOneAndRemove({ _id: childNode._id }, () => {
            // do nothing
          })
            .catch(err => res.json(err));
        });
        req.app.io.emit('delete factory', dbFactoryNode);
        res.json(dbFactoryNode);
      })
      .catch(err => res.json(err));
  },
};
