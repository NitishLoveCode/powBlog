const jwt=require("jsonwebtoken")



const auth=(req,res,next) => {
    // console.log("auth is working");
    try{
        const token =req.cookies.Token;
    if(token){
        // ------------token matching--------------------------
        const chaechAuth=jwt.verify(token,process.env.TOKEN_KEY)
        if(chaechAuth.id){
            // console.log("you have right cookies to access.");
            next()
        }
    }else(
        res.status(401).json({message: "Unauthorized"})
    )
    }catch(err){
        console.log("you are not allowed to access")
        res.status(401).json({message: "Unauthorized"})
    }
}


module.exports =auth