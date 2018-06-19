const FactoryNode = require('../models/factoryNode');
const FactoryChildNode = require('../models/factoryChildNode');
const FactoryContainerNode = require('../models/factoryContainerNode');
const Messages = require('../utils/ServerMessages');

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
      maxChildCount,
    } = req.body;

    // setup filter by id
    const filter = {
      _id: factoryId,
    };

    // set required params
    request.name = name;

    // do a quick range check
    if ((minChildValue && maxChildValue) &&
      (minChildValue >= maxChildValue)
    ) {
      res.status(500).json(Messages.INVALID_RANGE_SPECIFIED);
      return;
    }
    if (maxChildCount && maxChildCount > 15) {
      res.status(500).json(Messages.INVALID_CHILD_COUNT_SPECIFIED);
      return;
    }

    // set optional request data
    if (children) request.children = children;
    if (minChildValue) request.minChildValue = minChildValue;
    if (maxChildValue) request.maxChildValue = maxChildValue;
    if (maxChildCount) request.maxChildCount = maxChildCount;

    FactoryNode.findOne(filter)
      .then((dbFactoryNode) => {
        let rangeIsValid = true;
        if (minChildValue) {
          rangeIsValid = minChildValue > dbFactoryNode.maxChildValue ? false : true; // eslint-disable-line
        }
        if (maxChildValue) {
          rangeIsValid = maxChildValue < dbFactoryNode.minChildValue ? false : true; // eslint-disable-line
        }

        if (rangeIsValid) {
          FactoryNode.findOneAndUpdate(filter, request, { new: true })
            .populate({
              path: 'children',
              populate: {
                path: 'children',
                model: 'FactoryChildNode',
              },
            })
            .then((newDbFactoryNode) => {
              req.app.io.emit('update factory', newDbFactoryNode);
              res.json(dbFactoryNode);
            })
            .catch(err => res.json(err));
        } else {
          res.status(500).json(Messages.INVALID_RANGE_SPECIFIED);
        }
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
      maxChildCount,
    } = req.body;

    // set required params
    request.name = name;
    request.containerId = containerId;

    // do a quick range check
    if ((minChildValue && maxChildValue) &&
      (minChildValue >= maxChildValue)
    ) {
      res.status(500).json(Messages.INVALID_RANGE_SPECIFIED);
      return;
    }
    if (maxChildCount && maxChildCount > 15) {
      res.status(500).json(Messages.INVALID_CHILD_COUNT_SPECIFIED);
      return;
    }

    // set optional request data
    if (children) request.children = children;
    if (minChildValue) request.minChildValue = minChildValue;
    if (maxChildValue) request.maxChildValue = maxChildValue;
    if (maxChildCount) request.maxChildCount = maxChildCount;

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
