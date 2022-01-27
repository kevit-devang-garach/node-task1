const axios = require('axios');

const getData = async (req, res, next) => {
    try{
        async function getUsersData(url) {
            const response = await axios(url);
            // console.log(response.data)
            return response.data;
        }
        async function getPostsData(url) {
            const response = await axios(url);
            // console.log(response.data)
            return response.data;
        }
        async function getCommentsData(url) {
            const response = await axios(url);
            // console.log(response.data)
            return response.data;
        }
        const users = await getUsersData('https://jsonplaceholder.typicode.com/users');
        const posts = await getPostsData('https://jsonplaceholder.typicode.com/posts');
        const comments = await getCommentsData('https://jsonplaceholder.typicode.com/comments');
        console.log(users.length, posts.length, comments.length);
        req.data = { users, posts, comments };
        next();
        // res.status(200).send({users, posts, comments});
    }catch(e){
        res.status(403).send({status:403, error: "request failed"});
    }
}

module.exports = getData;