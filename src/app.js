const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const authentication = require("./middleware/authenticate");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.use("/user", require("./routes/user_route"));
app.use("/student", require("./routes/booking"));

app.get("/hello", authentication, (req, res) => {
  res.status(200).json({ message: "Inside protected route" });
});

sequelize
  .sync()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Application is listening on the port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Unable to sync with Database", err.message);
  });
