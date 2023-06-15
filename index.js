const express=require('express');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
let usermodel=require("./models/user")
let offermodel=require("./models/offer")
const dotenv=require('dotenv');
const saltRound=10;
const PORT=8080;

let app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}))

dotenv.config();



mongoose.connect(process.env.DATABASE_URL)
.then(()=>{
    console.log('Connected to cloud MongoDB Database');
})
.catch(e=>{
    console.log(`Couldn't to cloud MongoDB Database`,e.message);
})

function crypting(req,res,next)
{
let {user_name,password}=req.body;
bcrypt.hash(password,saltRound,(err,hash)=>{
    if(err)
    {
        res.json({message:err.message})
    }
    else
    {
        req.pass=hash;
        next()
    }
})
}


app.get("/",(req,res)=>{
res.send("Live Ops Engine")
})


app.post("/signup",crypting,(req,res)=>{
let {user_name}=req.body;

let new_user=new usermodel(
    {
        user_name,password:req.pass
    }
)

new_user.save()
.then(data=>{
    res.json({message:`${user_name} saved in DB`,data})
})
.catch(e=>{
    res.json({message:e.message})
})
})


app.post("/signin",(req,res)=>{
    let {user_name,password}=req.body;
     
    usermodel.findOne({user_name})
    .then(userdetails=>{
        
        bcrypt.compare(password, userdetails.password,(err, result)=>{
           
               if(err)
               {
                res.json({message:err.message})
               }
               else if(result)
               {
                  let token=jwt.sign({user_name,password:userdetails.password},process.env.KEY)
                  res.json({user_name,token})
               }
        });
    })


    })


app.post('/addoffer',(req,res)=>{
let token=req.headers['authorization'];

let user_details=jwt.verify(token,process.env.KEY);

let new_offer=new offermodel(
    {
        ...req.body,
        user_name:user_details.user_name
    }
)
new_offer.save()
.then(data=>{
    res.json({message:"offer added to DB",data})
})
.catch(e=>{
    res.json({message:e.message})
})
})


app.get("/Offers",(req,res)=>{
    let tosendOffers=[];
   offermodel.find()
   .then(data=>{
    data.forEach(data=>{
        let arr=(data.target.split("and")[0])
        
       if(arr.includes(">"))
       {
       
        if( parseInt(arr.split(">")[1])<req.body.age)
        {  
            tosendOffers.push(data)
        }
       }
       else
       {
        if( parseInt(arr.split("<")[1])>req.body.age)
        {
            tosendOffers.push(data)
        }
       }
    })
    res.json(tosendOffers)
   })
   .catch(e=>{
    console.log(e.message)
   })
})


app.put("/updateOffers/:id",(req,res)=>{
    let id=req.params['id'];
    let updateoffer=req.body;
    offermodel.findByIdAndUpdate(id,updateoffer)
    .then(data=>{
        res.json({message:'offer updated',data})
    })
    .catch(e=>{
        res.json({message:e.message})
    })

})


app.delete("/deleteOffer/:id",(req,res)=>{
    let id=req.params['id'];
    offermodel.findByIdAndDelete(id)
    .then(data=>{
        res.json({message:'offer delted'})
    })
    .catch(e=>{
        res.json({message:e.message})
    })
})




app.listen(PORT,()=>{
    console.log(`app listening at http://localhost:${PORT}/`)
})