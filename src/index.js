const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const userRoute = require('./routers/user');
app.use(userRoute);

app.listen(port, () => {
    console.log("Server runs on port:", port);
})