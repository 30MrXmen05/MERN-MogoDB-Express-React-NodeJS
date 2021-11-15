const express = require("express");
const connectdb = require("./config/db");

const app = express();

connectdb();

app.use(express.json({ extended: false }));
app.get("/", (req, res) => res.send("API Sending"));

app.use("/api/user", require("./routes/api/user"));
app.use("/api/post", require("./routes/api/post"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is Started at PORT ${PORT}`));

//🚀
