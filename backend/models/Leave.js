import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    employee: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true,},
    leaveType: {type: String, enum: ["Casual", "Earned", "Sick", "Weekoff"], required: true,},
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number },
    reason: { type: String, required: true, trim: true, minlength : 5, maxlength: 500 },
    status: {type: String,enum: ["pending", "approved", "rejected", "cancelled"], default: "pending",},
    approvedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    approvedComment: { type: String, trim: true },
    attachment: { type: String },
    leaveBalanceSnapshot: { type: Number },
},{ timestamps: true });

//date validation
leaveSchema.pre('save', function(next){
  if(this.endDate < this.startDate){  
    return next(new Error('end date cannot be before start date'))
  }
  // calculate total days
  if(this.startDate && this.endDate) { 
    const diff = this.endDate - this.startDate
    this.totalDays = diff / (1000 * 60 * 60 * 24) + 1
  }
})

leaveSchema.index({employee : 1, status : 1, startDate: 1, endDate : 1})

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
