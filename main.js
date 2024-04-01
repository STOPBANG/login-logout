const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

const layouts = require("express-ejs-layouts");
app.set("view engine", "ejs");
app.use(layouts);
app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    try {
      const decoded = jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET_KEY
      );
      res.locals.auth = decoded.userId;
      res.locals.userType = req.cookies.userType;
      res.locals.is_admin = adminControl.getAdmin(decoded.userId);
    } catch (error) {
      res.locals.auth = "";
      res.locals.userType = "";
      res.locals.is_admin = "";
    }
    next();
});

const authController = require("./controllers/authController");

app.post("/login", authController.login);

app.get("/logout", authController.logout);

app.listen(app.get('port'), () => {
  console.log(`Login app listening on port ${app.get('port')}`)
})