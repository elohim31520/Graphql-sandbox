var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const graphqlHTTP = require('express-graphql')
// const graphql = require('graphql')
const schema =require('./schema/schema.js')
const thirdlist =require('./schema/thirdlistSchema.js')
const deposit =require('./schema/depositeSchema.js')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/graphql');
var cors = require('cors')

var app = express();
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/graphql',graphqlHTTP({
    schema,
    graphiql: true
}))
app.use('/thirdlist',graphqlHTTP({
    schema: thirdlist,
    graphiql: true
}))

app.use('/deposit',graphqlHTTP({
    schema: deposit,
    graphiql: true
}))

module.exports = app;