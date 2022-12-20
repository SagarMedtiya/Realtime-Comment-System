require('dotenv').config()
const express = require('express')
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose')
const url = process.env.URL
//db connection
mongoose.set("strictQuery", false);
mongoose.connect(url).then(()=>{
    console.log('Connection Successful');
}).catch((error)=>{     
    console.log('Something went wrong', error)
});



const Comment=require('./models/comments')
app.use(express.json())
//routes
app.post('/api/comments',(req,res)=>{
    const comment = new Comment({
        
        username: req.body.username,
        comment: req.body.comment
    })
    comment.save().then(response=>{
        res.send(response)
    })
})

app.get('/api/comments',(req,res)=>{
    Comment.find().then(comments=>{
        res.send(comments)
    })
})

app.use(express.static('public'))
const server = app.listen(PORT, console.log(`Listening to ${PORT}`));

let io = require('socket.io')(server)

io.on('connection',(socket)=>{
    console.log(`New Connection: ${socket.id}`)
    //Recieve the event
    socket.on('comment',(data)=>{
        data.time = Date()
        socket.broadcast.emit('comment', data)
    })

    socket.on('typing',(data)=>{
        socket.broadcast.emit('typing', data)
    })
})

