import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { io } from "socket.io-client";
// import Peer from "simple-peer";
import { AuthContext } from "./AuthContext";

import SimplePeer from "simple-peer";

// update ID Room
import { doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";

export const SocketContext = createContext();

var socket = io("ws://localhost:5000", { transports: ["websocket"] });

socket.on("connect", function () {
  console.log("connected!");
  console.log("SocketId", socket.id);
});

// socket.on('respond', function (data) {
//   console.log(data);
// });
// const socket = io('https://warm-wildwood-81069.herokuapp.com');

export const SocketContextProvider = ({ children }) => {
  // Caller video

  const { currentUser, receiverUserId } = useContext(AuthContext);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peer, setPeer] = useState(null);

  const [call, setCall] = useState(false);

  const [currentSocketId, setCurrentSocketId] = useState(null);
  const [recevierSocketId, setRecevierSetSocketId] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    // Get user media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);

        // Create peer connection
        const newPeer = new SimplePeer({
          initiator: true,
          trickle: false,
          stream,
        });
        setPeer(newPeer);

        console.log(newPeer);

        // Handle signaling data
        newPeer.on("signal", (data) => {
          console.log(data);
          socket.emit("signal", {
            target: recevierSocketId, // Replace with the actual target socket ID
            signal: data,
            caller: currentSocketId,
          });
        });

        // Handle receiving signaling data
        socket.on("signal", (data) => {
          console.log("Received signal:", data);
          if (data.caller === recevierSocketId) return;
          newPeer.signal(data.signal);
        });

        // Handle receiving streaming data
        socket.on("stream", (stream) => {
          setRemoteStream(stream);
        });
      })
      .catch((error) => console.error(error));

    return () => {
      if (localStream) localStream.getTracks().forEach((track) => track.stop());
      if (peer) peer.destroy();
    };
  }, [currentSocketId || recevierSocketId]);

  console.log("Local", localStream);
  console.log("Remote", remoteStream);

  console.log(recevierSocketId);

  // useEffect (() => {
  //   if (currentUser) {
  //     const roomID = currentUser.uid;
  //     if (roomID) {
  //       const roomRef = doc(db, "chats", roomID + "_signalC_");

  //       const unsubscribe = onSnapshot(roomRef, (docSnapshot) => {
  //         if (docSnapshot.exists()) {
  //           setStateWindow(true)
  //         } else {
  //           setStateWindow(false)
  //         }
  //       });

  //       return () => {
  //         // Hủy đăng ký lắng nghe khi component unmount
  //         unsubscribe();
  //       };
  //     }
  //   }
  // }, [])

  const [myStream, setMyStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const myVideoRef = useRef();
  useEffect(() => {
    const socket = io("http://localhost:5000");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyStream(stream);
        myVideoRef.current.srcObject = stream;

        // Gửi sự kiện "join-room" với roomId đến máy chủ
        socket.emit("join-room", roomId);

        // Lắng nghe sự kiện khi có người gửi tín hiệu
        socket.on("signal", (data) => {
          const targetPeer = peers.find((p) => p.id === data.caller);
          if (targetPeer) {
            targetPeer.peer.signal(data.signal);
          }
        });

        // Lắng nghe sự kiện khi có người gửi dữ liệu streaming
        socket.on("stream", (data) => {
          const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream,
          });

          setPeers((prevPeers) => [...prevPeers, { id: data.id, peer }]);

          peer.signal(data.signal);

          peer.on("stream", (stream) => {
            // Hiển thị video của người nhận
            const video = document.createElement("video");
            video.srcObject = stream;
            video.play();
            document.body.appendChild(video);
          });
        });

        // Lắng nghe sự kiện khi có người ngắt kết nối
        socket.on("user-disconnected", (userId) => {
          const disconnectedPeer = peers.find((p) => p.id === userId);
          if (disconnectedPeer) {
            disconnectedPeer.peer.destroy();
            setPeers((prevPeers) => prevPeers.filter((p) => p.id !== userId));
          }
        });
      })
      .catch((error) => console.error("Error accessing media devices:", error));

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <SocketContext.Provider
      value={{
        call,
        setCall,
        currentSocketId,
        setCurrentSocketId,
        recevierSocketId,
        setRecevierSetSocketId,
        localStream,
        remoteStream,
        myVideoRef
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
