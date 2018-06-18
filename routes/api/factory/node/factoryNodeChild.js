const router = require('express').Router({ mergeParams: true });
const factoryNodeController = require('../../../../controllers/factoryChildNodeController');

router.route('/')
  .get(factoryNodeController.getFactoryChildNodes)
  .post(factoryNodeController.createFactoryChildNode);

router.route('/:nodeId')
  .get(factoryNodeController.getFactoryChildNode)
  .put(factoryNodeController.updateFactoryChildNode)
  .delete(factoryNodeController.deleteFactoryChildNode);

module.exports = router;
