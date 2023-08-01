import React, { useState, useRef, useEffect, useContext } from "react";
import SideBar from "../components/SideBar";
import Chat from "../components/Chat";
import { SocketContext } from "../context/SocketIOContext";

const Home = () => {
  return (
    <div className="h-screen bg-slate-300 flex justify-center items-center">
      <div className="flex h-[75%] w-[75%] border-solid border-[1px] border-sky-800 rounded-md overflow-hidden ">
        <SideBar />
        <Chat />
      </div>
    </div>
  );
};

export default Home;
