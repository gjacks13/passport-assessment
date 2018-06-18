const router = require('express').Router({ mergeParams: true });
const containerController = require('../../controllers/factoryContainerController');

router.route('/')
  .get(containerController.getContainers)
  .post(containerController.createContainer);

router.route('/:containerId')
  .get(containerController.getContainer)
  .put(containerController.updateContainer);

module.exports = router;
