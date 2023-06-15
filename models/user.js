const mongoose=require('mongoose');

let userSchema=new mongoose.Schema({
    user_name:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})

let userModel=mongoose.model("users",userSchema);

module.exports=userModel;
