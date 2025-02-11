import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import "./SidebarChat.css";
import axios from "axios";
import { Link } from "react-router-dom";

const SidebarChat = ({ addNewChat, name, id }) => {
  const [seed, setSeed] = useState("");

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createChat = async () => {
    const roomName = prompt("Enter the name for the group");
    if (roomName) {
      try {
        await axios.post("http://localhost:5000/group/create", {
          groupName: roomName,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar
          src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`}
        />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
        </div>
      </div>
    </Link>
  ) : (
    <div className="sidebarChat" onClick={createChat}>
      <h2>Add new chat</h2>
    </div>
  );
};

export default SidebarChat;
