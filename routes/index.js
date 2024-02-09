const express = require("express");
const router = express.Router();
const auth = require("../middleware");

const protect = auth.protect;

router.get("/login", (req, res) => {
    const { authenticated } = req.session;
    
    if (!authenticated) {
        req.session.authenticated = true;
        res.send("Successfully authenticated");
    } else {
        res.send("Already authenticated");
    }
});

router.get("/logout", protect, (req, res) => {
    req.session.destroy(() => {
      res.send("Successfully logged out");
    });
  });
  
router.get("/protected", protect, (req, res) => {
    const { name = "user" } = req.query;
    res.send(`Hello ${name}!`);
});

module.exports = router;