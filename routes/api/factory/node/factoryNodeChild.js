const router = require('express').Router({ mergeParams: true });
const factoryChildNodeController = require('../../../../controllers/factoryChildNodeController');
const { check, validationResult } = require('express-validator/check');

router.route('/')
  .get(factoryChildNodeController.getFactoryChildNodes)
  .post([
    check('name').optional().trim().escape(),
    check('minChildValue').optional().isInt({ gt: 0 }).toInt(),
    check('maxChildValue').optional().isInt({ gt: 0 }).toInt(),
    check('nodeValues').isArray(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    return factoryChildNodeController.createFactoryChildNodes(req, res);
  })
  .delete(factoryChildNodeController.deleteFactoryChildNodes);

module.exports = router;
