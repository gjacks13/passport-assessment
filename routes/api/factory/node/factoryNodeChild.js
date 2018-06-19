const router = require('express').Router({ mergeParams: true });
const factoryChildNodeController = require('../../../../controllers/factoryChildNodeController');

router.route('/')
  .get(factoryChildNodeController.getFactoryChildNodes)
  .post(factoryChildNodeController.createFactoryChildNodes)
  .delete(factoryChildNodeController.deleteFactoryChildNodes);

module.exports = router;
