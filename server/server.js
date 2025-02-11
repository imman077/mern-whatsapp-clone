const express = require("express");
const mongoose = require("mongoose");
const Rooms = require("./dbRooms");
const dotenv = require("dotenv");
const cors = require("cors");
const Messages = require("./dbMessages");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1938823",
  key: "80e1d772793ca27bb355",
  secret: "627a06b83905eab1462a",
  cluster: "ap2",
  useTLS: true,
});

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const dbUrl = process.env.MONGODB_URL;

mongoose.connect(dbUrl);

const db = mongoose.connection;

let isRoomStreamAttached = false;
let isMessageStreamAttached = false;

db.on("error", (err) => console.error("MongoDB connection error:", err));
db.once("open", () => {
  console.log("DB Connected");

  // Room Change Stream
  if (!isRoomStreamAttached) {
    isRoomStreamAttached = true;
    const roomCollection = db.collection("rooms");
    const changeStream = roomCollection.watch();

    changeStream.on("change", (change) => {
      console.log("Room Change:", change);

      if (change.operationType === "insert") {
        const roomDetails = change.fullDocument;
        pusher.trigger("room", "inserted", roomDetails);
      }
    });
  }

  // Message Change Stream
  if (!isMessageStreamAttached) {
    isMessageStreamAttached = true;
    const msgCollection = db.collection("messages");
    const changeStream1 = msgCollection.watch();

    changeStream1.on("change", (change) => {
      console.log("Message Change:", change);

      if (change.operationType === "insert") {
        const messageDetails = change.fullDocument;
        pusher.trigger("messages", "inserted", messageDetails);
      }
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from Server");
});

app.get("/room/:id", async (req, res) => {
  try {
    const data = await Rooms.find({ _id: req.params.id });
    res.status(201).send(data[0]);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/messages/:id", async (req, res) => {
  try {
    const data = await Messages.find({ roomId: req.params.id });
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/messages/new", async (req, res) => {
  try {
    const dbMessage = req.body;
    const data = await Messages.create(dbMessage);
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/group/create", async (req, res) => {
  try {
    const name = req.body.groupName;
    const data = await Rooms.create({ name });
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/all/rooms", async (req, res) => {
  try {
    const data = await Rooms.find({});
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(5000, () => {
  console.log("Server is Up and running");
});
