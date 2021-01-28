require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const CookieParser = require("cookie-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 8000;

// DB connection.......
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB connected is already done");
  })
  .catch((err) => {
    console.log("Error is", err);
  });

//  Custom middlewares

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentBraintreeRoutes = require("./routes/paymentBraintree");
const contactRoutes = require("./routes/contact");

// My Routes.......
app.use("/api", authRoutes); //localhost:8000/api/signout
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentBraintreeRoutes);
app.use("/api", contactRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.listen(port, () => {
  console.log(
    "hello duniya.........i m learning MERN here!!!!!!!!!!! at ",
    process.env.PORT
  );
});
