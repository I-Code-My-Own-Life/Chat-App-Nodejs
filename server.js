const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const formatMessage = require("./utils/messages");
const { users, joinUser, getCurrentUser, userLeave, getRoomUsers } = require("./utils/user");
const app = express();

const PORT = 5000;
const BotName = "Chat Bot"

// Creating a server : 
const server = http.createServer(app);
// Initializing the socket connection : 
const io = socketio(server);
// Public folder path : 
const publicPath = path.join(__dirname, "public");
// Setting static folder : 
app.use(express.static(publicPath));

// Run when a client connects : 
io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
        const user = joinUser(socket.id, username, room);
        // Joining the room : 
        socket.join(user.room);
        // Sending a message: (This message will only go the single connected user. )
        socket.emit("message", formatMessage(BotName, "Welcome to chat application made by me."));
        // Broadcast when a user connects: (This message will go to all clients except the client. )
        socket.broadcast.to(user.room).emit("message", formatMessage(BotName, `${user.username} has joined the chat.`));

        // Send users and room info : 
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
    // Listen for chatMessage : 
    socket.on("chatMessage", (msg) => {
        let currentUser = {};
        users.forEach((user) => {
            if (user.id == socket.id) {
                currentUser = user;
            }
        })
        io.to(currentUser.room).emit("message", formatMessage(currentUser.username, msg));
    })
    // Runs when client disconnects : 
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        // This message will go to everyone :
        if (user) {
            io.to(user.room).emit('message', formatMessage(BotName, `${user.username} has left the chat.`));
            // Send users and room info : 
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    });
})
// Listening to the server : 
server.listen(PORT, () => {
    console.log(`The server has been started at ${PORT}`);
});



