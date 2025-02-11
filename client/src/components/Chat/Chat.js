import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@mui/material";
import {
  AttachFile,
  InsertEmoticon,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import axios from "axios";
import { useStateValue } from "../ContentApi/StateProvider";
import { useParams } from "react-router-dom";
import Pusher from "pusher-js";

const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const [roomName, setRoomName] = useState("");
  const [{ user }] = useStateValue();
  const { roomId } = useParams();
  const [updatedAt, setUpdatedAt] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/room/${roomId}`).then((response) => {
      setRoomName(response.data.name);
      setUpdatedAt(response.data.updatedAt);
    });
    axios.get(`http://localhost:5000/messages/${roomId}`).then((response) => {
      setMessages(response.data);
    });
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  useEffect(() => {
    const pusher = new Pusher("80e1d772793ca27bb355", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (message) {

      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      channel.unbind_all(); // Remove all event bindings
      channel.unsubscribe(); // Unsubscribe from Pusher channel
    };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input) {
      return;
    }
    await axios.post("http://localhost:5000/messages/new", {
      message: input,
      name: user.displayName,
      timestamp: new Date(),
      uid: user.uid,
      roomId: roomId,
    });
    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar
          src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`}
        />
        <div className="chat__headerInfo">
          <h3>{roomName ? roomName : "Welcome to Whatsapp"}</h3>
          <p>
            {updatedAt
              ? `Last updated at ${new Date(updatedAt).toString().slice(0, 25)}`
              : "Click on any Group"}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message, index) => (
          <p
            className={`chat__message ${
              message.uid === user.uid && "chat__receiver"
            }`}
            key={index}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp).toString().slice(0, 25)}
            </span>
          </p>
        ))}
      </div>
      {roomName && (
        <div className="chat__footer">
          <InsertEmoticon />
          <form>
            <input
              placeholder="Type a Message"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <button onClick={sendMessage}>Send a message</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;
