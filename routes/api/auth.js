const express = require("express");
const router = express.Router();
const auth = require("../../middelware/auth");
const User = require("../../models/User");

//@Route    Get api/auth
//@desc     Test route
//@access   Public

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
