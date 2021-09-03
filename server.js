const express = require('express');
const app = express();
const server = require('http').Server(app);
const {v4: uuidv4} = require('uuid');
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug : true
});


app.set("view engine","ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);

app.get("/", (req, res) =>{
  res.redirect(`/${uuidv4()}`);
});


app.get("/:room", (req, res) => {
  res.render("room" , {
    roomId: req.params.room
  });
});


io.on("connection", socket => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);
    socket.on("message", message => {
      io.to(roomId).emit("createMessage", message)
    })
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


server.listen(port);
