require('dotenv').config()
const express = require('express')
const app = express();
const PORT = process.env.PORT || 5000;



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
})