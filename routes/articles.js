const { render } = require('ejs')
var express = require('express')
var Article = require('./../models/articles')
var router = express.Router()

router.get('/new' , (req,res)=>{
    res.render('articles/new' , {article:new Article()})
})

router.get('/edit/:id' , async (req,res)=>{
    const article = await Article.findById(req.params.id)
    res.render('articles/edit' , {article:article})
})

router.get('/:slug',async (req,res)=>{
    const article = await Article.findOne({slug :req.params.slug}) // Use findOne as we want to find one article and not an array of article
    // If id is wrong on database
    if(article == null){
        res.redirect('/')
    }
    res.render('articles/show', {article:article})
})
// next says go on to the next function in the list
router.post('/',async (req,res,next)=>{
   req.article = new Article()
   next()
},saveArticleAndReadirect('new'))

router.put('/:id',async (req,res,next)=>{
    req.article = await Article.findById(req.params.id)
    next()
 },saveArticleAndReadirect('edit'))

router.delete('/:id',async (req,res) =>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndReadirect(path){
    return async (req,res)=>{
        let article = req.article
        article.title = req.body.title
        article.categories = req.body.categories
        article.content = req.body.content
        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        }
        catch(e){
            console.log(e)
            res.render(`articles/${path}`, {article:article})
        }        
    }
}
module.exports = router