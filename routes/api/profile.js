const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middelware/auth");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");

const profile = require("../../models/Profile");
const user = require("../../models/User");

//@Route    Get api/profile/me
//@desc     Get Current Profile
//@access   Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"],
    );
    if (!profile) {
      return res.status(400).json({
        msg: "There is no Profile",
      });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@Route    Post api/profile/me
//@desc     Create New Profile or Update Existing Profile
//@access   Private

router.post(
  "/editprofile",
  [
    auth,
    [
      check("status", "status is required").isEmpty(),
      check("skills", "skills is required").isEmpty(),
    ],
  ],
  async (req, res) => {
    // console.log(req);
    // console.log(req.body.formData.company);
    const errors = validationResult(req);
    // console.log("Errors", errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instragarm,
      linkdin,
    } = req.body.formData;

    // console.log("data passed", { skills });

    //Get Profile ready
    const profilefields = {};
    profilefields.user = req.user.id;
    if (company) profilefields.company = company;
    if (website) profilefields.website = website;
    if (location) profilefields.location = location;
    if (bio) profilefields.bio = bio;
    if (status) profilefields.status = status;
    if (githubusername) profilefields.githubusername = githubusername;
    if (skills)
      profilefields.skills = skills.split(",").map((skill) => skill.trim());

    //Build Social Object
    profilefields.social = {};

    if (youtube) profilefields.social.youtube = youtube;
    if (facebook) profilefields.social.facebook = facebook;
    if (twitter) profilefields.social.twitter = twitter;
    if (instragarm) profilefields.social.instragarm = instragarm;
    if (linkdin) profilefields.social.linkdin = linkdin;

    // console.log("Profile fields check", profilefields);

    try {
      // update
      let profile = await Profile.findByIdAndUpdate(
        req.user.id,
        profilefields,
        {
          upsert: true,
        },
      );

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  },
);

//@Route    Get api/profile
//@desc     Get All Users
//@access   Private
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@Route    Get api/profile/user/:userID
//@desc     Get user by ID
//@access   Private
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "Profile Not found" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile Not found" });
    }
    res.status(500).send("Server Error");
  }
});

//@Route    Delete User or Profile
//@desc     Delete Users
//@access   Private
router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove User
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User OR Profile Removed Successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@Route    PUT api/profile/experience
//@desc     Add experience Users
//@access   Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "company is required").not().isEmpty(),
      check("from", "From Date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    console.log(newExp);

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      console.log(profile);

      profile.experience.unshift(newExp);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  },
);

//@Route    Delete api/profile/experience
//@desc     Remove experience Users
//@access   Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get Remove Index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {}
});

//@Route    PUT api/profile/education
//@desc     Add education in Users
//@access   Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "school is required").not().isEmpty(),
      check("college", "college is required").not().isEmpty(),
      check("fieldofstudy", "fieldofstudy is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { school, college, fieldofstudy, from, to, current, description } =
      req.body;
    const newEdu = {
      school,
      college,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    console.log(newEdu);

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      console.log(profile);

      profile.education.unshift(newEdu);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  },
);

//@Route    Delete api/profile/education
//@desc     Remove education Users
//@access   Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get Remove Index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {}
});

//@Route    Get api/profile/github/:username
//@desc     get github repo in Users
//@access   Public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubclientid",
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        res.status(404).json({ msg: "No Github Profilr Found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
