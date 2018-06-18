const router = require('express').Router({ mergeParams: true });
const factoryController = require('../../../controllers/factoryNodeController');

router.route('/')
  .get(factoryController.getFactories)
  .post(factoryController.createFactory);

router.route('/:factoryId')
  .get(factoryController.getFactory)
  .put(factoryController.updateFactory)
  .delete(factoryController.deleteFactory);

module.exports = router;
