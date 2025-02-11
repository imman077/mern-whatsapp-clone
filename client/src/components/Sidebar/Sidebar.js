import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from "@mui/material";
import { useStateValue } from "../ContentApi/StateProvider";
import {
  Chat,
  DonutLarge,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import SidebarChat from "../SidebarChat/SidebarChat";
import axios from "axios";
import Pusher from "pusher-js";

const Sidebar = () => {
  const [{ user }] = useStateValue();
  const [rooms, setRooms] = useState([]);

  // useEffect(() => {
  //   console.log(rooms);
  // }, [rooms]);

  useEffect(() => {
    axios.get("http://localhost:5000/all/rooms").then((response) => {
      setRooms(response.data);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("80e1d772793ca27bb355", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("room");
    channel.unbind_all();
    channel.bind("inserted", function (room) {
      console.log(rooms);
      console.log(room);

      setRooms((prevRooms) => [...prevRooms, room]);
    });
    return () => {
      channel.unbind_all(); // Remove all event bindings
      channel.unsubscribe(); // Unsubscribe from Pusher channel
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Search or start a new chat" />
        </div>
      </div>
      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat key={room._id} id={room._id} name={room.name} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
