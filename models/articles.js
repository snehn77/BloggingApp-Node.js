var mongoose = require('mongoose')
var marked = require('marked')
var slugify = require('slugify')
var createDomPurifier = require('dompurify')
var {JSDOM} = require('jsdom')

var dompurify = createDomPurifier(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    categories:{
        type : String,
        required:true
    },
    content : {
        type : String,
        required: true
    },
    createdAt:{
        type : Date,
        default : Date.now
    },
    slug:{
        type : String,
        required:true,
        unique: true
    },
    sanitizedHTML:{
        type:String,
        required:true
    }
})

// Every time update delete or any opertion is called this function is also called
articleSchema.pre('validate', function(next){
    if(this.title){
        this.slug = slugify(this.title , {lower:true ,strict:true}) // Strict:true remove collen and any other character from title
    }
    if(this.content){
        // prifies the HTML to get rid of any malicious code
        this.sanitizedHTML = dompurify.sanitize(marked(this.content))
    }
    next()
})
module.exports = mongoose.model('Article', articleSchema)