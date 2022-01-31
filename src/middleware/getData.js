const axios = require('axios');

async function getUsersData(url) {
    const response = await axios(url);
    return response.data;
}
async function getPostsData(url) {
    const response = await axios(url);
    return response.data;
}
async function getCommentsData(url) {
    const response = await axios(url);
    return response.data;
}

const getData = async (req, res, next) => {
    try{
        const users = await getUsersData('https://jsonplaceholder.typicode.com/users');
        const posts = await getPostsData('https://jsonplaceholder.typicode.com/posts');
        const comments = await getCommentsData('https://jsonplaceholder.typicode.com/comments');
        req.data = { users, posts, comments };
        next();
    }catch(e){
        res.status(403).send({status:403, error: "request failed"});
    }
}

module.exports = getData;