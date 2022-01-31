const axios = require('axios');
const express = require('express');
const userRouter = express.Router();

const getData = require('../middleware/getData');

async function getPostCommentData(url){
    const result = await axios(url);
    let commentData = [];
    result.data.filter((data)=>{
        const values ={name: data.name, body: data.body}
        commentData.push(values);
    })
    return commentData;
}

userRouter.get('/users/:email/:name', getData, async (req, res) => {
    // http://localhost:3000/users/Nikita@garfield.biz/odio%20adipisci%20rerum%20aut%20animi
    try{
        const comment = req.data.comments.filter((data)=> (data.email === req.params.email) && (data.name === req.params.name))
        const post = req.data.posts.filter((data) => data.id == comment[0].postId);
        const user = req.data.users.filter((data) => data.id == post[0].userId);
        const postUser = {
            username: user[0].username,
            name: user[0].name,
            email: user[0].email
        }
        if(comment.length){
            res.status(200).send(postUser);
            return;
        }
        res.status(404).send({status:404, error: "no user found"});
    }
    catch(e){
        res.status(403).send({status:403, error:"request failed"});
    }
});

userRouter.get('/users/:username', getData, async (req, res) => {
    // http://localhost:3000/users/Bret
    try {
        const user = req.data.users.filter((data) => data.username === req.params.username);
        const posts = req.data.posts.filter((data) => data.userId == user[0].id);
        const userDetails  = {
            username: user[0].username, 
            name: user[0].name, 
            email:user[0].email, 
            city: user[0].address.city,
            posts:[]
        }

        posts.forEach(post => {
            userDetails.posts.push({
                title: post.title
            })
        });
        
        for (let i = 0; i < posts.length; i++) {
            userDetails.posts[i]['comments']= ( await  getPostCommentData(`https://jsonplaceholder.typicode.com/comments?postId=${i+1}`));
        }

        if(user.length){
            res.status(200).send(userDetails);
            return;
        }
        res.status(404).send({status:404, error: "no user found"});
        
    }
    catch (e) {
        res.status(403).send({status:403, error:"request failed"});
    }
})

module.exports = userRouter;