const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
  note: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //user id created from user.js 
  }
 
},{timestamps:true})

module.exports = mongoose.model('Note', NoteSchema)
