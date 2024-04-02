const jwt = require('jsonwebtoken');
const secret = 'Tech4dev';

const users = {
    userName: "Tech4dev",
    password: "Tech4dev@2024"
}

const adminLogin = (req, res) => {
    const { userName, password } = req.body; // Assuming userName and password are sent in the request body

    // If userName or password is not provided in the request, use default credentials
    if (!userName || !password) {
        const token = jwt.sign(users, secret); // Using default credentials
        console.log(token);
        return res.send({ token });
    }

    // Check if the provided credentials match the default credentials
    if (userName === users.userName && password === users.password) {
        const token = jwt.sign({ userName }, secret);
        console.log(token);
        return res.send({ token });
    } else {
        return res.status(401).send({ message: 'Invalid credentials' });
    }
}

module.exports = { adminLogin };
