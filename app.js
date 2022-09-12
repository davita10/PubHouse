// invoke express and store in variable app
// require methods together at top
const express = require("express");
const mongoose = require("mongoose");
const MONGOURI = "mongodb://localhost/ecommerce";
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
require("dotenv").config();
// import routes
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const categoryRoutes = require("./routes/category.route");
const productRoutes = require("./routes/product.route");

// app
const app = express();

// db
// mongoose connect method w two arg: dburl, config options
mongoose
  .connect(MONGOURI)
  // .connect(process.env.DATABASE, {
  //   useNewUrlParser: true,
  //   useCreateIndex: true,
  // })
  .then(() => console.log("DB Totally Connected"));

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
// gets json data from request body
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is ready to boogie on port ${port}`);
});
