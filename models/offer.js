const mongoose=require('mongoose');

let offerSchema=new mongoose.Schema({
    "offer_id":{type:String,required:true}, 
    "offer_title":{type:String,required:true}, 
    "offer_description":{type:String,required:true}, 
    "offer_image":{type:String,required:true}, 
    "offer_sort_order":{type:Number,required:true}, 
    "content":{type:Array,required:true}, 
    "schedule":{type:Object,required:true}, 
    "target":{type:String,required:true}, 
    "pricing":{type:Object,required:true},
    "user_name":{type:String,required:true}
    
})

let offerModel=mongoose.model("offers",offerSchema);

module.exports=offerModel;
