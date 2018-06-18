const router = require('express').Router({ mergeParams: true });
const factoryNodeChildRoutes = require('./node');
const factoryNodeRoutes = require('./factoryNode');

// api routes
router.use('/factory', factoryNodeRoutes);
router.use('/factory/:factoryId', factoryNodeChildRoutes);

module.exports = router;
