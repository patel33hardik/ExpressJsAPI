const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    const userMatches = users.filter((user) => user.username === username);
    return userMatches.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    if(isValid(username)){
        const matchingUsers = users.filter((user) => user.username === username && user.password === password);
        return matchingUsers.length > 0;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let user = req.body.username;
    let pass = req.body.password;
    if(!authenticatedUser(user,pass)){
        return res.status(403).json({message:"User not authenticated"})
    }

    let accessToken = jwt.sign({
        data: user
    },'access',{expiresIn:60*60})
    req.session.authorization = {
        accessToken
    }
    res.send("User logged in Successfully")
 
});

// Add a book review
regd_users.post("/auth/review/:isbn", (req, res) => {
    let userd = req.session.username;
    let ISBN = req.params.isbn;
    let details = req.query.review;
    let rev = {user:userd,review:details}
    books[ISBN].reviews = rev;
    return res.status(201).json({message:"Review added successfully"})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let ISBN = req.params.isbn;
    books[ISBN].reviews = {}
    return res.status(200).json({messsage:"Review has been deleted"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
