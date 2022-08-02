// Node Server which will handle socket io connection

const io = require("socket.io")(8000, {
    cors:{
        origin:"*"  // allow all origins and to avoid CORS issues
    }
});
const users = {};

io.on("connection", socket => {
    // if new user joins the chat, let all the users know
    socket.on("new-user-joined", name => {
        console.log(name, "joined the chat");
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name); // broadcast the user joined event to all the users
    });

    // if user sends a message, let all the users know
    socket.on("send", message => {
        socket.broadcast.emit("receive", { message: message, name: users[socket.id]}); // broadcast the message to all the users
    });

    // if user disconnects, let all the users know
    socket.on("disconnect", message => {
        socket.broadcast.emit("left", users[socket.id]); // broadcast the message to all the users
        delete users[socket.id];
    });
});