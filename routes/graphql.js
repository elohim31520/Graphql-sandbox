var express = require('express');
var router = express.Router();
const graphqlHTTP = require('express-graphql')
// const graphql = require('graphql')
// const schema =require('../schema')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
