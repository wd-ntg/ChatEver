import React, { useContext } from "react";
import { useEffect } from "react";
import { db } from "../firebase";
import { getDoc, doc, onSnapshot, setDoc } from "firebase/firestore";

import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketIOContext";

var socket = io("ws://localhost:5000", { transports: ["websocket"] });

function ReceiverVideoCall() {
  const {
    call,
    setCall,
    currentSocketId,
    setCurrentSocketId,
    recevierSocketId,
    setRecevierSetSocketId,
    localStream,
    remoteStream,
  } = useContext(SocketContext);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const handleSetSocketIdRecevierCall = async () => {
      if (currentUser && socket.id) {
        const roomID = currentUser.uid + "_signalR_";
        const roomRef = doc(db, "chats", roomID);
        await setDoc(roomRef, { recevierCallSocketId: socket.id }, { merge: true });
        console.log("Tài liệu đã được cập nhật hoặc tạo mới thành công!");
        setRecevierSetSocketId(socket.id)
        setCall(true)
      }
    };
    handleSetSocketIdRecevierCall();
  }, [socket.id]);

  console.log(socket.id);

  console.log(remoteStream)

  console.log(recevierSocketId)

  return <div>ReceiverVideoCall</div>;
}

export default ReceiverVideoCall;
