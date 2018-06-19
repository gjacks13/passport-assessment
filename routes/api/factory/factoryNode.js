const router = require('express').Router({ mergeParams: true });
const factoryController = require('../../../controllers/factoryNodeController');
const { check, validationResult } = require('express-validator/check');

router.route('/')
  .get(factoryController.getFactories)
  .post([
    check('name').not().isEmpty().isString()
      .withMessage('name cannot be empty.'),
    check('name').trim().escape(),
    check('containerId').not().isEmpty().isString()
      .withMessage('containerId cannot be empty.'),
    check('containerId').trim().escape(),
    check('minChildValue').optional().isInt().toInt(),
    check('maxChildValue').optional().isInt().toInt(),
    check('maxChildCount').optional().isInt().toInt(),
    check('children').optional().isArray(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    return factoryController.createFactory(req, res);
  });

router.route('/:factoryId')
  .get(factoryController.getFactory)
  .put([
    check('name').not().isEmpty().isString()
      .withMessage('name cannot be empty.'),
    check('name').trim().escape(),
    check('minChildValue').optional().isInt().toInt(),
    check('maxChildValue').optional().isInt().toInt(),
    check('maxChildCount').optional().isInt().toInt(),
    check('children').optional().isArray(),
  ], (req, res) => {
    const errors = validationResult(req);
    let a = errors.array();
    let b = req.body;
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    return factoryController.updateFactory(req, res);
  })
  .delete(factoryController.deleteFactory);

module.exports = router;
