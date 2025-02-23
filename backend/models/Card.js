const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  cards: {
    type: [String],
    required: true
  }
});

const Card = mongoose.model('Card', CardSchema);
module.exports = Card;
