const FactoryChildNode = require('../models/factoryChildNode');
const FactoryNode = require('../models/factoryNode');

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
    } = req.body;

    // setup filter by id
    const filter = {
      _id: nodeId,
    };

    // set request data
    if (name) request.name = name;
    if (minValue) request.minValue = minValue;
    if (maxValue) request.maxValue = maxValue;

    FactoryChildNode.findOneAndUpdate(filter, request, { new: true })
      .then((dbFactoryChildNode) => {
        res.json(dbFactoryChildNode);
      })
      .catch(err => res.json(err));
  },

  createFactoryChildNode(req, res) {
    const request = {};
    const {
      name,
      minChildValue,
      maxChildValue,
    } = req.body;

    const { factoryId } = req.params;

    // set request data
    if (name) request.name = name;
    if (minChildValue) request.minChildValue = minChildValue;
    if (maxChildValue) request.maxChildValue = maxChildValue;

    FactoryNode.findOne({ _id: factoryId })
      .then((dbFactory) => {
        // only add if this factory has <15 child nodes
        if (dbFactory.children.length < 15) {
          const newFactory = new FactoryChildNode(request);
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
                  res.json(dbFactoryChildNode);
                })
                .catch(err => res.json(err));
            })
            .catch(err => res.json(err));
        } else {
          // hit max number of additions send error message back
          res.status(500).end('Could not add any additional nodes.');
        }
      }).catch(err => res.json(err));
  },

  deleteFactoryChildNode(req, res) {
    const { nodeId } = req.params;
    const filter = {
      _id: nodeId,
    };
    FactoryChildNode.findOneAndRemove(filter)
      .then((dbFactoryChildNode) => {
        res.json(dbFactoryChildNode);
      })
      .catch(err => res.json(err));
  },
};
