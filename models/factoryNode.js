const mongoose = require('mongoose');

const { Schema } = mongoose;

const factoryNodeSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 20,
  },
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'FactoryChildNode',
  }],
  maxChildCount: {
    type: Number,
    default: 15,
  },
  minChildValue: {
    type: Number,
    default: 1,
  },
  maxChildValue: {
    type: Number,
    default: 25,
  },
  containerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const FactoryNode = mongoose.model('FactoryNode', factoryNodeSchema);

module.exports = FactoryNode;
