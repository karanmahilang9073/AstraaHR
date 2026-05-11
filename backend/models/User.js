import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true, minlength : 2, maxlength : 20},
    email: {type: String, required: true, unique: true, index : true, lowercase: true, match : [/^\S+@\S+\.\S+$/, 'please enter a valid email']},
    password: {type: String, required: true, minlength: 6, select : false},
    role: {type: String, enum: ["HR", "Admin", "Employee"], default: "Employee",},
    department: {type: String, default: "General",},
    position: {type: String, trim : true},
},{timestamps: true,});


const User = mongoose.model("User", userSchema);
export default User;
