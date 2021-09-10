var express = require('express')
var Article = require('./models/articles')
var mongoose = require('mongoose')
var articleRouter = require('./routes/articles')
var methodOverride = require('method-override')
var path = require('path');

var app = express()

app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method')) 

// Static files
// app.use(express.static('public'))
console.log(__dirname);
// app.use('/css', express.static(__dirname + '/public/css'))
//app.use('/image', express.static(__dirname + '/public/image'))
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect('mongodb://localhost/blog', {
    useNewUrlParser:true , useUnifiedTopology: true, useCreateIndex:true
})
// Wherever you pass _method now this will override

app.get('/', async (req,res) => {
    const articles = await Article.find().sort({createdAt:'desc'})
    res.render('articles/index' , {articles : articles})
})

app.use('/articles',articleRouter)
console.log("Port 3000 is running")
app.listen(5000);
