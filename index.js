const express = require("express");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const http = require("http");
const chalk = require("chalk");
const cors = require("cors");
const keys = require("./config/keys");
//const helmet = require('helmet')

var whitelist = ["http://localhost:3000", "https://twitter-rp.herokuapp.com"];
var corsOptions = {
  exposedHeaders: ["x-auth-token"],
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

//create express application
const app = express();

/**
 * MIDDLEWARES
 */

// set up cors to allow us to accept requests from our client
app.use(cors(corsOptions));

//passport authentication strategy for twitter
// initalize passport
app.use(passport.initialize());
require("./config/passport")(passport);

app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "../../client/build/")));

//making body available to read in request object
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Redirect to api routes
app.use("/api", require("./routes"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const server = http.createServer(app);
const port = process.env.PORT || 5000;

//add socket.io connection later

// 🌎 Listen to PORT
server.listen(port, () =>
  console.log(chalk.magenta(`server eavesdropping on port ${port}`))
);
