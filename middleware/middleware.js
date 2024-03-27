const mid = ((req,res,next) => {
    req.text = "Send some text";
    console.log("sending middleware");
    next();
})

module.exports={mid}