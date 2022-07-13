const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registeredUser'
    },
    title: {
        type: String,
        required: true,
        maxLength: 100
    },

    description: {
        type: String,
        required: true,
        maxLength: 1000
    },

    tag: {
        type: [String],
        default: '-'
    },

    createdOn: {
        type: Date,
        default: Date.now
    },

    dueDate: {
        type: Date
    },

    Status: {
        type: String,
        default: 'Open'
    }
});

module.exports = mongoose.model('tasks', TaskSchema);