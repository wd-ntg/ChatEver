import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { AuthContext } from "./AuthContext";
import { ChatContext } from "./ChatContext";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

// update ID Room
import {
  doc,
  updateDoc,
  deleteDoc,
  getDoc
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";

const SocketContext = createContext();

const socket = io("http://localhost:5000");
// const socket = io('https://warm-wildwood-81069.herokuapp.com');

const SocketContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const IDCall = uuidv4();

  const ID = Object.entries(data);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });
    socket.on("me", (id) => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    handleDeleteRoom()

    navigate('/home')
    window.location.reload();
  };

  const updateRoom = async () => {
    try {
      const roomId = `${currentUser.uid}`; // Định nghĩa ID tài liệu tùy ý
      const roomRef = doc(db, "chats", roomId); // Tạo tham chiếu đến tài liệu mới
  
      const roomSnapshot = await getDoc(roomRef);
      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data();
        if (roomData && roomData.messages && roomData.messages.length > 0) {
          // Cập nhật trường text của thông báo tại messageIndex trong mảng messages
          roomData.messages[0].text = me;
  
          // Sử dụng updateDoc để chỉ cập nhật một trường text trong mảng messages
          await updateDoc(roomRef, {
            messages: roomData.messages,
          });
        }
      }
  
    } catch (error) {
      console.error("Error creating chat document:", error);
    }
  };

  updateRoom()


  const handleDeleteRoom = async () => {
    try {
      const roomId = `${currentUser.uid}`;
      const roomRef = doc(db, "chats", roomId); 
  
      await deleteDoc(roomRef);
  
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };
  
  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        IDCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContextProvider, SocketContext };
