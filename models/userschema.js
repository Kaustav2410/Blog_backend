const mongoose =require('mongoose')
const {Schema,model} = mongoose;

const userSchema= new Schema({
    username:{
        type:String,
        required:true,
        unique: true,
        min:4,
    },
    password:{
        type: String,
        required:true
    }
});

const UserModel = model('User',userSchema);
module.exports=UserModel;