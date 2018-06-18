const router = require('express').Router({ mergeParams: true });
const containerRoutes = require('./container');
const factoryNodeRoutes = require('./factory');

// api routes
router.use('/container', containerRoutes);
router.use('/container/:containerId', factoryNodeRoutes);

module.exports = router;
