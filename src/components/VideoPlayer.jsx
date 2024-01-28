import React, { useContext, useState, useEffect } from "react";
import { Grid, Typography, Paper, makeStyles } from "@material-ui/core";
import { getDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { SocketContext } from "../context/SocketIOContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { ChatContext } from "../context/ChatContext";
import { NotifyContext } from "../context/NotifyContext";
import { io } from "socket.io-client";

var socket = io("ws://localhost:5000", { transports: ["websocket"] });

const useStyles = makeStyles((theme) => ({
  video: {
    width: "550px",
    [theme.breakpoints.down("xs")]: {
      width: "300px",
    },
  },
  gridContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px",
  },
}));

const VideoPlayer = () => {
  // const {
  //   name,
  //   callAccepted,
  //   myVideo,
  //   userVideo,
  //   callEnded,
  //   stream,
  //   call,
  //   setMe,
  //   me,
  // } = useContext(SocketContext);

  // console.log("MyVideo", myVideo)
  // console.log("UserVideo", userVideo)

  const { currentUser, receiverUserId } = useContext(AuthContext);

  const { data, dispatch } = useContext(ChatContext);

  const { notify, setNotify, stateWindow, setStateWindow } =
    useContext(NotifyContext);

  const {
    call,
    setCall,
    currentSocketId,
    setCurrentSocketId,
    recevierSocketId,
    setRecevierSetSocketId,
    localStream,
    remoteStream,
    myVideoRef

  } = useContext(SocketContext);

  const navigate = useNavigate();

  const classes = useStyles();

  const [userName, setUserName] = useState("");

  const [userDataReceiver, setUserDataReceiver] = useState(null);

  // Xung đột do viết logic trước đó bị sai
  // Reload

  // const navigateFromVideoCall = async () => {
  //   try {
  //     if (currentUser.uid) {
  //       const roomRef = doc(db, "chats", currentUser.uid);
  //       const roomSnapshot = await getDoc(roomRef);
  //       if (roomSnapshot.exists()) {
  //       } else {
  //         navigate("/home");
  //         window.location.reload();
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching 'chats' data:", error);
  //   }
  // };

  // navigateFromVideoCall();

  // setInterval(() => {
  //   navigateFromVideoCall();
  // }, 20000);

  const handleGetDataUserRecevie = async () => {
    if (receiverUserId) {
      const userId = receiverUserId;
      const roomRef = doc(db, "users", userId);
      try {
        // Lấy dữ liệu từ tham chiếu
        const roomSnapshot = await getDoc(roomRef);

        if (roomSnapshot.exists()) {
          // Dữ liệu tài liệu tồn tại
          const userData = roomSnapshot.data();
          if (userData) {
            setUserDataReceiver(userData);
          }
        } else {
          console.log("Tài liệu không tồn tại.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ tham chiếu:", error);
      }
    }
  };

  useEffect(() => {
    handleGetDataUserRecevie();
  }, [receiverUserId]);

  useEffect(() => {
    const handleSetSocketIdCall = async () => {
      if (receiverUserId) {
        const roomID = receiverUserId + "_signalR_";
        const roomRef = doc(db, "chats", roomID);
        await setDoc(
          roomRef,
          { currentCallSocketId: socket.id },
          { merge: true }
        );
        console.log("Tài liệu đã được cập nhật hoặc tạo mới thành công!");
        setCurrentSocketId(socket.id);
      }
    };
    handleSetSocketIdCall();
  }, [socket.id || recevierSocketId || currentSocketId]);

  console.log(socket.id);

  console.log(localStream)

  console.log(recevierSocketId)

  console.log(remoteStream)

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-zinc-800">
      {stateWindow ? (
        <div>
          <div className="flex justify-center items-center">
            {call ? (
              <div className="flex flex-col justify-center items-center">
                <video
                  playsInline
                  ref={remoteStream}
                  autoPlay
                  className={classes.video}
                />
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <img
                  className="w-24 h-24 rounded-full m-4"
                  src={userDataReceiver?.photoURL}
                />
                <div className="text-white font-bold text-xl mb-2">
                  {userDataReceiver?.displayName}
                </div>
                <div className="text-white font-semibold text-xs ml-2">
                  Đang gọi ...
                </div>
              </div>
            )}
            <div className="flex absolute bottom-10 w-[320px] justify-between">
              <div className="w-8 h-8 bg-slate-400 rounded-full flex justify-center items-center">
                <Icon
                  className="text-white text-2xl"
                  icon="ri:exchange-2-fill"
                />
              </div>
              <div className="w-8 h-8 bg-slate-400 rounded-full flex justify-center items-center">
                <Icon
                  className="text-white text-2xl"
                  icon="fluent:people-add-24-regular"
                />
              </div>
              <div className="w-8 h-8 bg-slate-400 rounded-full flex justify-center items-center">
                <Icon
                  className="text-white text-2xl"
                  icon="streamline:webcam-video-solid"
                />
              </div>
              <div className="w-8 h-8 bg-slate-400 rounded-full flex justify-center items-center">
                <Icon
                  className="text-white text-2xl"
                  icon="material-symbols:mic"
                />
              </div>
              <div className="w-8 h-8 bg-red-500 rounded-full flex justify-center items-center">
                <Icon
                  className="text-white text-2xl"
                  icon="material-symbols:call-end"
                />
              </div>
            </div>
          </div>
          <div className="absolute right-4 rounded-md bottom-4 w-[280px] h-280px z-50">
            <video
              playsInline
              muted
              ref={myVideoRef}
              autoPlay
              className={classes.video}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col justify-center items-center">
            <img
              className="w-24 h-24 rounded-full m-4"
              src={userDataReceiver?.photoURL}
            />
            <div className="text-white font-bold text-xl mb-2">
              {userDataReceiver?.displayName}
            </div>
          </div>
          <div className="text-xl text-white">
            Không có phản hồi từ cuộc gọi
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
