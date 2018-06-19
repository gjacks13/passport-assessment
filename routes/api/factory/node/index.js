const router = require('express').Router({ mergeParams: true });
const factoryNodeChildRoutes = require('./factoryNodeChild');

// api routes
router.use('/node', factoryNodeChildRoutes);

module.exports = router;
