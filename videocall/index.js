
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const SimplePeer = require("simple-peer");

const app = express();
const server = http.createServer(app);

const io = socketIo(server);

app.use(cors());

const peers = {};

// io.on("connection", (socket) => {

//   // Handle signaling data
//   socket.on("signal", (data) => {
//     // Send signaling data to the target client
//     io.to(data.target).emit("signal", {
//       signal: data.signal,
//       caller: data.caller,
//     });

//   });

//   // Handle streaming data
//   socket.on("stream", (stream) => {
//     // Broadcast the stream to other clients
//     socket.broadcast.emit("stream", stream);
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     // Notify other clients about the disconnection
//     socket.broadcast.emit("user-disconnected", socket.id);
//   });
// });

// server.js

io.on("connection", (socket) => {
  // Lưu trữ danh sách các peer
  const peers = [];

  // Gửi sự kiện "user-connected" cho người gọi khi có người nhận tham gia
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", socket.id);

    // Lắng nghe sự kiện khi có người nhận tín hiệu
    socket.on("signal", (data) => {
      io.to(data.target).emit("signal", {
        signal: data.signal,
        caller: data.caller,
      });
    });

    // Lắng nghe sự kiện khi có người gửi dữ liệu streaming
    socket.on("stream", (stream) => {
      io.to(roomId).emit("stream", { id: socket.id, stream });
    });

    // Lắng nghe sự kiện khi có người ngắt kết nối
    socket.on("disconnect", () => {
      io.to(roomId).emit("user-disconnected", socket.id);
    });
  });
});


server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
