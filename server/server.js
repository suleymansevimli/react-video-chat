const express = require('express');
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    origins: ['*'],
    cors: {
        origin: "*",
        methods: ["GET", "POST", 'PUT', 'DELETE', 'PATCH']
    }
});


io.on('connection', socket => {

    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        })
    })
})


server.listen(3005);

