const app = require("./app");
require("dotenv").config();
const mongoose = require("mongoose");

const DB = process.env.LOCALDB;
const PORT = process.env.PORT || 14000;
// ,{
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true,

//   }
mongoose
  .connect(DB)
  .then(_ => console.log("DB connected"))
  .catch((e) => console.log("error", e));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
