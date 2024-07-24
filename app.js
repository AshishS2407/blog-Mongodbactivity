const express = require('express');
const mongoose = require ('mongoose')
const app = express();
const PORT = 3008;
const path= require('path');
const sample = require('./Models/blog')
const dotenv = require ('dotenv')
dotenv.config()

const uri = process.env.mongo_uri;

mongoose.connect(uri)

const database = mongoose.connection;
database.on("error", (error)=> {
    console.log("Error", error)
})
database.once("connected", ()=> {
    console.log("Database Connected")
})

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'blog.html'));
})

app.get('/submitted', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'submit.html'));
})

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewblog.html'));
})

app.get('/viewallblogs', async (req, res) => {
    try{
        const blogs = await sample.find();
        res.json(blogs)
    }catch (error){
        console.log(error)
        res.status(500).json({ error: 'Error retriving blog post' });
    }
})

app.post('/blog', async(req,res) => {
    const {BlogID, title, author, content } = req.body;
    console.log(req.body);
    const newPost = new sample({BlogID, title, author, content });
    try{
        await newPost.save()
        res.redirect('/submitted');

    }catch (error){
        console.log(error)
        res.status(500).json({ error: 'Error saving blog post' });
    }
})

app.get('/blog/:id', async (req,res) => {
    const id = req.params.id;
    const blogs = await sample.findOne({BlogID : id});
    if (!blogs) {
      return res.status(404).send("Blog not found");
    }
  
    res.sendFile(path.join(__dirname, 'public', 'viewblog.html'));
})

app.get('/api/blog/:id', async (req,res) => {
    const id = req.params.id;
    const blogs = await sample.findOne({BlogID : id})
    if (!blogs) {
        return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blogs);
})

app.listen(PORT, () => {
    console.log (`THe application is running in ${PORT}`)
})


