import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("registerCurrentID", (currentID) => {
      currentID = parseInt(currentID, 10);
      console.log("registerCurrentID event", currentID);
      socket.join(currentID);
      socket.currentID = currentID;
    });

    socket.on("registerTargetID", (targetID) => {
      targetID = parseInt(targetID, 10);
      console.log("registerTargetID event", targetID);
      socket.targetID = targetID;
    });

    socket.on("chat", (msg) => {
        console.log("chat event from", socket.currentID, "to", socket.targetID);
        // Send message with sender information
        io.to(socket.targetID).emit("receiveMsg", {
            text: msg,
            from: socket.currentID
        });
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});