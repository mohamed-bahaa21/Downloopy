const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');

let env = dotenv.config({})
if (env.error) throw env.error;
env = dotenvParseVariables(env.parsed);
// console.log(env);

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}), bodyParser.json());

const routes = require('./routes/app.routes');
app.use('/', routes)

app.listen(3000, console.log("Main Server: 3000"));