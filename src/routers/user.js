const express = require('express');
const userRouter = express.Router();
const axios = require('axios');
const getData = require('../middleware/getData');
userRouter.post('/users', (req, res) => {
    res.status(200).send({ status: 200, message: "user route post request" });
})

userRouter.get('/users', getData, async (req, res) => {
    // http://localhost:3000/users
    try {
        res.status(200).send(req.data);
    }
    catch (e) {
        res.status(403).send({status:403, error:"request failed"});
    }
})

async function getPostCommentData(url){
    const result = await axios(url);
    let dval = [];
    result.data.filter((data)=>{
        const dvalue ={name: data.name, body: data.body}
        dval.push(dvalue);
    })
    // console.log(await dval)
    return await dval;
}
userRouter.get('/users/:email/:name', getData, async (req, res) => {
    // http://localhost:3000/users/Nikita@garfield.biz/odio%20adipisci%20rerum%20aut%20animi
    // console.log(req.params.email, req.params.name);
    try{
        const comment = await req.data.comments.filter((data)=> (data.email === req.params.email) && (data.name === req.params.name))
        // console.log("comment", comment[0].postId);
        const post = await req.data.posts.filter((data) => data.id == comment[0].postId);
        // console.log("post",post[0].id);
        const user = await req.data.users.filter((data) => data.id == post[0].userId);
        // console.log("user",user[0].id);
        const postUser = {
            username: user[0].username,
            name: user[0].name,
            email: user[0].email
        }
        if(comment.length){
            // console.log("postUser",postUser);
            res.status(200).send(postUser);
        }
        else{
            res.status(404).send({status:404, error: "no user found"});
        }
    }
    catch(e){
        res.status(403).send({status:403, error:"request failed"});
    }
});
userRouter.get('/users/:username', getData, async (req, res) => {
    // http://localhost:3000/users/Bret
    // console.log(req.params.username);
    try {
        const user = await req.data.users.filter((data) => data.username === req.params.username);
        const posts = await req.data.posts.filter((data) => data.userId == user[0].id);
        const userDetails  = {
            username: user[0].username, 
            name: user[0].name, 
            email:user[0].email, 
            city: user[0].address.city,
            posts:[]
        }

       await posts.forEach(post => {
            userDetails.posts.push({
                title: post.title
            })
        });
        
        await ( async() => {
            for (let i = 0; i < posts.length; i++) {
                userDetails.posts[i]['comments']= ( await  getPostCommentData(`https://jsonplaceholder.typicode.com/comments?postId=${i+1}`));
            }
        })();
        if(user.length){
            // console.log("userDtails",userDetails)
            res.status(200).send(userDetails);
        }
        else{
            res.status(404).send({status:404, error: "no user found"});
        }
    }
    catch (e) {
        res.status(403).send({status:403, error:"request failed"});
    }
})


module.exports = userRouter;