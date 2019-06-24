var express=require('express')
var app=express()
const server = require('http').createServer(app);
var path=require('path')
var logger=require('morgan')
var index = require('./route/index')
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use('/' ,express.static('public'))
app.use('/',index)

app.listen(3000,function () {
    console.log("Server is running at port 3000")

})