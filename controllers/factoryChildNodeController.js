const FactoryChildNode = require('../models/factoryChildNode');
const FactoryNode = require('../models/factoryNode');
const Messages = require('../utils/ServerMessages');
const NumberValidator = require('../utils/NumberValidator');

module.exports = {
  getFactoryChildNodes(req, res) {
    /* creating the filter const here isn't really necessary but it
     * makes it easier for someone else to extend filtering options
     * in the future.
     * */
    const filter = {};
    FactoryChildNode.find(filter)
      .then((dbFactoryChildNodes) => {
        res.json(dbFactoryChildNodes);
      })
      .catch(err => res.json(err));
  },

  getFactoryChildNode(req, res) {
    const filter = {};
    const { factoryNodeId } = req.params;
    if (factoryNodeId) {
      filter._id = factoryNodeId;
    }

    FactoryChildNode.find(filter)
      .then((dbFactoryChildNode) => {
        res.json(dbFactoryChildNode);
      })
      .catch(err => res.json(err));
  },

  updateFactoryChildNode(req, res) {
    const request = {};
    const { nodeId } = req.params;
    const {
      name,
      minValue,
      maxValue,
      value,
    } = req.body;

    // setup filter by id
    const filter = {
      _id: nodeId,
    };

    // validate params
    // set request data
    if (name) request.name = name;
    if (minValue && NumberValidator.isPositiveInteger(minValue)) {
      request.minValue = minValue;
    }
    if (maxValue && NumberValidator.isPositiveInteger(maxValue)) {
      request.maxValue = maxValue;
    }
    if (value && NumberValidator.isPositiveInteger(value)) {
      request.value = value;
    }
    FactoryChildNode.findOneAndUpdate(filter, request, { new: true })
      .then((dbFactoryChildNode) => {
        req.app.io.emit('update node', dbFactoryChildNode);
        res.json(dbFactoryChildNode);
      })
      .catch(err => res.json(err));
  },

  createFactoryChildNodes(req, res) {
    const request = {};
    const {
      name,
      minChildValue,
      maxChildValue,
      nodeValues,
    } = req.body;

    const { factoryId } = req.params;

    // validate params
    if (!Array.isArray(nodeValues)) {
      res.status(500).json(Messages.INVALID_PARAMETER_SPECIFIED);
    }

    // set request data
    if (name) request.name = name;
    if (minChildValue && NumberValidator.isPositiveInteger(minChildValue)) {
      request.minChildValue = minChildValue;
    }
    if (maxChildValue && NumberValidator.isPositiveInteger(maxChildValue)) {
      request.maxChildValue = maxChildValue;
    }
    if (!nodeValues) {
      res.status(500).json('No node values specified.');
    }

    if (!factoryId) {
      res.status(500).json('No factory id present');
    }
    request.factoryId = factoryId;

    // filter and make sure what we send to the server is nothing but an array of integers
    const filteredNodes = nodeValues.filter(nodeValue => Number.isInteger(nodeValue));

    FactoryNode.findOne({ _id: factoryId })
      .then((dbFactory) => {
        // only add if adding these nodes to factory would result in <=15 child nodes
        if (dbFactory.children.length + nodeValues.length <= 15) {
          filteredNodes.forEach((nodeValue) => {
            // create a new node in the database for this node value
            const nodeObj = Object.assign({}, request, { value: nodeValue });
            const newFactory = new FactoryChildNode(nodeObj);
            FactoryChildNode.create(newFactory)
              .then((dbFactoryChildNode) => {
                /* push this nodechild onto the factory container child array, for the
                 * factory specified in the route params
                 * */
                FactoryNode.findOneAndUpdate(
                  { _id: factoryId },
                  { $push: { children: dbFactoryChildNode._id } },
                  { new: true },
                )
                  .then(() => {
                    req.app.io.emit('add node', dbFactoryChildNode);
                    res.json(dbFactoryChildNode);
                  })
                  .catch(err => res.json(err));
              })
              .catch(err => res.json(err));
          });
        } else {
          // hit max number of additions send error message back
          res.status(500).end('Could not add any additional nodes.');
        }
      }).catch(err => res.json(err));
  },

  deleteFactoryChildNodes(req, res) {
    const {
      factoryId,
    } = req.params;

    const factoryFilter = {
      _id: factoryId,
    };

    FactoryNode.findOneAndUpdate(factoryFilter, { children: [] })
      .then((dbFactoryNode) => {
        const nodeIds = dbFactoryNode.children;
        if (nodeIds.length) {
          nodeIds.forEach((nodeId) => {
            const nodeFilter = {
              _id: nodeId,
            };
            FactoryChildNode.findOneAndRemove(nodeFilter)
              .then((dbFactoryChildNode) => {
                req.app.io.emit('delete node', dbFactoryChildNode);
                res.json(dbFactoryChildNode);
              })
              .catch(err => res.json(err));
          });
        } else {
          res.end();
        }
      })
      .catch(err => res.json(err));
  },
};
