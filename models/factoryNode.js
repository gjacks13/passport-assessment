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
    required: true,
    default: 1,
  },
  maxChildValue: {
    type: Number,
    required: true,
    default: 25,
  },
});

const FactoryNode = mongoose.model('FactoryNode', factoryNodeSchema);

module.exports = FactoryNode;
