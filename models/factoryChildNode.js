const mongoose = require('mongoose');

const { Schema } = mongoose;

const factoryChildeNodeSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 20,
  },
  minValue: {
    type: Number,
    default: 1,
  },
  maxValue: {
    type: Number,
    default: 25,
  },
});

const FactoryChildNode = mongoose.model('FactoryChildNode', factoryChildeNodeSchema);

module.exports = FactoryChildNode;
