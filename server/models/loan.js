const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const encrypt = require('bcrypt');
const LoanModel = new Schema({
    borrowerId: {
        type: Schema.Types.ObjectId,
        ref: 'Borrower'
    },
    adminId:{
        type: Schema.Types.ObjectId,
        ref: 'admins'
    },
    loanCategory: {
        type: String,
        default:''
    },
    principleAmount: {
        type: Number,
        default:0.0
    },
    rateType:{
        type:String,
        default : ""
    },
    ratePerMonth:{
        type:Number,
        default : 0.0
    },
    amountPending:{
        type:Number,
        default : 0.0
    },
    amountPaid:{
        type:Number,
        default : 0.0
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    maintenanceCharges:{
        type:Number,
        default : 0.0
    }, 
    startDate:{
        type:Number,
        default : 0.0
    },
    endDate:{
        type:Number,
        default : 0.0
    },
    intrest:{
        type:Number,
        default : 0.0
    },
    description:{
        type:String,
        default:""
    },
    amountPaid:{
        type:Number,
        default:0.0
    },
    pendingAmount:{
        type:Number,
        default:0.0
    },
    status:{
        type:String,
        enum:["pending","approved"],
        default:"pending"
    },
   
}, {
    timestamps: true,
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
});

const Loan = mongoose.model('Loan', LoanModel);
module.exports = Loan;
