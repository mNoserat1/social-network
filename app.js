const express = require("express");
const app = express();
const userRouters = require("./routes/userRoutes")
const psotRouters = require("./routes/postRoutes")
const cookieParser = require("cookie-parser")
const cors = require("cors")



app.use(express.json());
app.use(cookieParser())
app.use(cors())

app.use("/api/v1/user", userRouters)
app.use("/api/v1/post", psotRouters)
// app.use(express.static(`${__dirname}/public`));

module.exports = app;
