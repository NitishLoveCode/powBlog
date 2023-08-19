const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const cors = require("cors");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 8000;
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
require("./server/conn");
const register_schema = require("./models/Register");
app.use(express.json());
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
app.use(cookieParser());
const fs = require("fs");
const new_post_create = require("./models/New_post");
const auth = require("./Auth/Auth");
const path = require("path");

// ------------------public uploads file------------
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// ----------------------register new user --------------------------
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    if (name && email && password) {
      const hashPassword = await bcrypt.hash(password, 10);
      const registring = new register_schema({
        name: name,
        email: email,
        password: hashPassword,
      });
      const registered = await registring.save();
      console.log(registered);
      if (registered._id) {
        const token = jwt.sign({ id: registered._id }, process.env.TOKEN_KEY);
        console.log(token);
        res.cookie("Token", token).status(200).send({
          name: registered.name,
          email: registered.email,
          id: registered.id,
        });
        // GENERATING OTP-------------------------
        // ------------NOW SENDING CONFORMATION MAIL TO USER EMAIL---------------------

        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_AUTH,
            pass: process.env.GMAIL_AUTH_PASS,
          },
        });

        var mailOptions = {
          from: process.env.GMAIL_AUTH,
          to: email,
          subject: "Thanks for registering PowBloag!",
          text: `You have sucessfully registered to PowBlog enjoy writing bloags`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        // ---------------------------------------------------------------------
      }
      console.log(registered);
    }
  } catch (err) {
    console.log(err.code);
    if (err.code === 11000) {
      res.status(409).send("User already registered. ");
    } else {
      res.send("something went wrong, please try again");
      console.log(err);
    }
  }
});

// --------------------------------login function here------------------------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password)
    const credentials_find = await register_schema.findOne({ email: email });
    console.log(credentials_find)
    if(credentials_find){
        console.log("enter")
        const pass_match = await bcrypt.compare(
            password,
            credentials_find.password
          );
          if (pass_match) {
            const token = jwt.sign(
              { id: credentials_find._id },
              process.env.TOKEN_KEY
            );
            res.cookie("Token", token).status(200).send({
              name: credentials_find.name,
              email: credentials_find.email,
              id: credentials_find.id,
            });
          } else {
            res.status(404).send({ status: "404 Not Found" });
          }
    }else{
        res.status(404).send({ status: "404 Not Found" });
    }
  } catch (err) {
    console.log(err);
  }
});

// ------------------------------home data sending------------------------------

app.get("/header", async (req, res) => {
  console.log("called header");
  const cookies = req.cookies.Token;
  console.log(cookies);
  if (cookies) {
    const user_id = jwt.verify(cookies, process.env.TOKEN_KEY);
    // ----------finding user finfo from databse----
    const user_info = await register_schema.findOne({ _id: user_id.id });
    res.status(200).json({ name: user_info.name, email: user_info.email });
  }
});

// ------------------logining out ------------------------------
app.get("/logout", async (req, res) => {
  res
    .clearCookie("Token")
    .status(200)
    .json({ status: "sucessfully logoged out." });
  console.log("logged out");
});

// -----create new post-------------------
app.post("/new-post", auth, upload.single("Thumbnail"), async (req, res) => {
  const data = req.file;
  if (data.originalname) {
    const filename = data.originalname.split(".");
    const ext = filename[filename.length - 1]; //file actual extantion here
    const originalname = filename[0]; //actual file name here
    var new_image_name = originalname + " " + new Date().getTime() + "." + ext;
    fs.renameSync(`./uploads/${data.filename}`, `./uploads/${new_image_name}`);
  }

  // -----------------------now sending newpost to database-------------------
  try {
    const { title, discription, user_id, user_name, content } = req.body;
    const new_post_entry = await new_post_create({
      title: title,
      description: discription,
      content: content,
      thumbnail: `./uploads/${new_image_name}`,
      postedBy: user_id,
      user_name: user_name,
    });
    const created_new_post = await new_post_entry.save();
    console.log(created_new_post);
    if(created_new_post._id){
        res.status(200).send("status:New post created successfully")
    }
  } catch (err) {
    console.log(err);
  }
});

// --------------------------sending all post data to homepage------------------
app.get("/", async (req, res) => {
  try {
    const all_posts = await new_post_create.find(
      {},
      {
        _id: 1,
        title: 1,
        description: 1,
        thumbnail: 1,
        postedBy: 1,
        user_name: 1,
        created: 1,
      }
    );
    // console.log(all_posts)
    if (all_posts.length > 0) {
      res.status(200).send(all_posts);
    }
  } catch (err) {
    console.log(err);
  }
});


// -----------user auth for enter into create post------------------------
app.get("/new-post-auth",auth,(req,res) =>{
    res.status(200).send("you are authenticated.");
})


// --------------single post find---------------------------------
app.post("/single-post",async(req,res) =>{
    const {id}=req.body;
    console.log(id);
    try{
        const post= await new_post_create.findOne({_id:id});
        console.log(post);
        if(post._id){
            const{title,description,content,thumbnail,user_name,postedBy,created}=post
            res.status(200).send({title:title,description:description,created,content:content,thumbnail:thumbnail,user_name:user_name,postedBy:postedBy})
        }else{
            res.status(404).send("Not Found")
        }
    }catch(err){
        console.log(err)
        res.status(404).send({status: '404 Not Found'})
    }
})


// --------------------edit post --------------------

app.post("/edit-post",async(req,res)=>{
    try{
        const {editId}=req.body
        const token =req.cookies.Token;
        const find_Edit_data=await new_post_create.findOne({_id:editId})
        if(find_Edit_data.postedBy){
            const edit_user=jwt.verify(token,process.env.TOKEN_KEY)
            if(edit_user.id==find_Edit_data.postedBy){
                const{title,description,content,thumbnail}=find_Edit_data
                res.status(200).send({title:title,description:description,content:content,thumbnail:thumbnail})

            }else{
                res.status(401).send({status:"Unauthorized"});
            }
        }

    }catch(err){
        console.log(err)
    }
    
    
})



app.listen(port, async () => {
  console.log(`server is listening on ${port}`);
});
