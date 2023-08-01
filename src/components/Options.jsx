import React, { useState, useContext, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

import { SocketContext } from "../context/SocketIOContext";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Sidebar = ({ children }) => {
  const {
    me,
    callAccepted,
    name,
    setName,
    callEnded,
    leaveCall,
    callUser,
    IDCall,
  } = useContext(SocketContext);

  const [idUser, setIdUser] = useState("");

  const [idToCall, setIdToCall] = useState("");

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ID = Object.entries(data);

  const fetchChatData = async () => {
    setName(currentUser.displayName);
    try {
      if (currentUser.uid) {
        const roomRef = doc(db, "chats", currentUser.uid);
        const roomSnapshot = await getDoc(roomRef);
        if (roomSnapshot.exists()) {
          const roomData = roomSnapshot.data();
          // setIdToCall(roomData.messages[0].text);
          setIdUser(roomData.messages[0].img);
        } else {
          console.log("No document found with ID:", currentUser.uid);
        }
      }
    } catch (error) {
      console.error("Error fetching 'chats' data:", error);
    }
  };

  fetchChatData();

  const getDataID = async () => {
    try {
      const roomRef = doc(db, "chats", idUser);
      const roomSnapshot = await getDoc(roomRef);
      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data();
        setIdToCall(roomData.messages[0].text);
      } else {
        console.log("No document found with ID:", idUser);
      }
    } catch (error) {
      console.error("Error fetching 'chats' data:", error);
    }
  };

  getDataID();

  // callUser(idToCall);

  return (
    <div className="flex justify-center">
      <div className="w-[240px]">
        {callAccepted && !callEnded ? (
          <button onClick={leaveCall} className="">
            Hang Up
          </button>
        ) : (
          <button
            onClick={() => {
              callUser(idToCall);
              getDataID();
            }}
          >
            Xác nhận cuộc gọi
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
