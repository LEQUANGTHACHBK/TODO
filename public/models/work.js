const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
    content: String,
    checked: Boolean,
    createTime: Date
})
module.exports = mongoose.model("work",workSchema);