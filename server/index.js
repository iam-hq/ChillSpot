import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import chatroomRoutes from "./routes/chatrooms.js";
import messageRoutes from "./routes/messages.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import { createServer } from "http";
import { Server } from "socket.io";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/chatrooms", chatroomRoutes);
app.use("/messages", messageRoutes);

/* APP SERVER */
const server = createServer(app);

/* SOCKET IO */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let socketUsers = [];

const addUser = (userId, socketId) => {
  !socketUsers.some(user => user.userId === userId) &&
    socketUsers.push({userId, socketId});
}

const removeUser = (socketId) => {
  socketUsers = socketUsers.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
  console.log(socketUsers);
  return socketUsers.find((user) => user.userId === userId);
}

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("addUser", userId => {
    addUser(userId, socket.id);
    io.emit("getUsers", socketUsers);
  });

  socket.on("join_chat", (data) => {
    console.log("Join Room", data);
    socket.join(data.chatroomId);
  });

  socket.on("send_message", (data) => {
    // const {receiverId} = data;
    // const user = getUser(receiverId);
    // if(user.length > 0) {
    //   io.to(user[0].socketId).emit("getMessage", data);
    // } else {
    //   io.to(user.socketId).emit("getMessage", data);
    // }

    io.to(data.chatroomId).emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", socketUsers);
  })
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
