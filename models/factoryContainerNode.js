/*
 * This model isn't exactly required. However, establishing a model
 * that can serve as the parent for any collection of 'factories',
 * allows us to create groupings easily in the future. It's not really needed
 * for this application. Since, the requirements only specify the need for
 * one 'root' node, containing all the factory nodes. So, any factory we
 * defined would implicitly be a child of the 'root' node. Specifing this model
 * explicitly defines the relationship and ensures future scalability.
 * So, it's nice to have.
 * */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const factoryContainerNodeSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    maxlength: 30,
  },
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'FactoryNode',
  }],
});

const FactoryContainerNode = mongoose.model('FactoryContainerNode', factoryContainerNodeSchema);

module.exports = FactoryContainerNode;
