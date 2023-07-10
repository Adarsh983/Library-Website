const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id : {
        type : mongoose.SchemaTypes.Number,
        required : true,
        unique: true,
    },
    name: {
        type: mongoose.SchemaTypes.String,
        required : true,
    },
    borrower: {
        type: mongoose.SchemaTypes.String,
        required : true,
    }
}, {timestamps: true } );

module.exports = mongoose.model('User' , userSchema);