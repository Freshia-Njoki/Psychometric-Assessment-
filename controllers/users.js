const jwt = require('jsonwebtoken');
const secret = 'Tech4dev';

const users = {
    // userId : 1,
    userName : "Freshia",
}

const adminLogin = (req, res) => {
    const token = jwt.sign(users,secret);//takes in payload and secret
    console.log(token);
    res.send({token})
}

exports.login = async (req,res) => {
    

}
module.exports={adminLogin}