const authModel = require("../models/authModel");
const jwt = require("jsonwebtoken");

module.exports = {
    login: async (req, res) => {
        // Login
        authModel.getUser(req.body, (userId, isAgent) => {
          // Error during login
          if (!userId) {
            return res.json({'authToken': null})
          } else {
            const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY);
            res.cookie("authToken", token, {
              maxAge: 86400_000,
              httpOnly: true,
            });
            res.cookie("userType", isAgent ? 0 : 1, {
              maxAge: 86400_000,
              httpOnly: true,
            });
            return res.redirect('/');
          }
        });

    },
    
    logout: async (req, res) => {
        res.clearCookie("userType");
        res.clearCookie("authToken").redirect("/");
    },
}