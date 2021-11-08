const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

//@Route    Post api/user
//@desc     Test route
//@access   Public

router.post(
  "/",
  [
    check("name", "name is Required").not().isEmpty(),
    check("email", "please enter valid mail ID").isEmail(),
    check("password", "Please enter valid password").isLength(8),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(500)
          .json({ errors: [{ msg: "user Already exist!" }] });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // const salt = await bcrypt.getSalt(10);

      user.password = await bcrypt.hash(password, 10);

      await user.save();

      res.send("User Route");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  },
);

module.exports = router;
