require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("./models/admin.model");
require("./models/cart.model");
require("./models/user.model");
require("./models/blog.model");
require("./models/coupon.model");
require("./models/product_category.model");
require("./models/product_color.model");
require("./models/product.model");
require("./models/order.model");
require("./models/FAQ.model");
require("./models/site_banner.model");
require("./models/site_trending_product.model");
const auth_routes = require("./routes/auth.routes");
const product_category_routes = require("./routes/product_category.routes");
const product_color_routes = require("./routes/product_color.routes");
const product_routes = require("./routes/product.routes");
const user_routes = require("./routes/user.routes");
const user_cart_routes = require("./routes/cart.routes");
const blog_routes = require("./routes/blog.routes");
const coupon_routes = require("./routes/coupon.routes");
const faq_routes = require("./routes/FAQ.routes");
const user_order_routes = require("./routes/order.routes");
const site_banner_routes = require("./routes/site_banner.routes");
const about_banner_routes = require("./routes/about_banner.routes");
const site_trending_product_routes = require("./routes/site_trending_product.routes");
const product_varient_routes=require('./routes/product_varient.routes');
const tnc_routes=require("./routes/tnc.routes");
const PORT = process.env.PORT ||8080;
const MONGO_URI = process.env.MONGO_URI;

mongoose.set("strictQuery", true);
mongoose.connect(MONGO_URI);
const database = mongoose.connection;

database.on("error", err => console.log(err, "Error connecting db."));
database.once("connected", () => console.log("Database Connected."));

const app = express();
app.use(express.json({ extended: true }));

app.get("/",(req,res)=>{
    res.status(200).json({message:"Tribes backend server is running"});
})
app.listen(PORT, () => console.log(`Listening on PORT:`, PORT));
app.use(cors({ origin: "*" }));


app.use(auth_routes);
app.use(product_category_routes);
app.use(product_color_routes);
app.use(product_routes);
app.use(user_routes);
app.use(user_cart_routes);
app.use(user_order_routes);
app.use(blog_routes);
app.use(coupon_routes);
app.use(faq_routes);
app.use(site_banner_routes);
app.use(about_banner_routes);
app.use(site_trending_product_routes);
app.use(product_varient_routes)
app.use(tnc_routes);
