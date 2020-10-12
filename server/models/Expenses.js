const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const encrypt = require('bcrypt');
const ExpensesModel = new Schema({
    type: {
        type: String,default:''
    },
    description: {
        type: String,default:''
    },
    price: {
        type: String,index:true,default:''
    },
    adminId:{
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    
}, {
    timestamps: true,
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
});

const Expenses = mongoose.model('Expenses', ExpensesModel);
module.exports = Expenses;
