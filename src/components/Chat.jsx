import React, { useContext, useEffect, useState } from "react";
import Cam from "../img/cam.png";
import More from "../img/more.png";
import Add from "../img/add.png";
import Messages from "./Messages";
import InputMessage from "./InputMessage";
import { ChatContext } from "../context/ChatContext";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";


import { addDoc } from "firebase/firestore";
import { ref, getDatabase, push, serverTimestamp } from "firebase/database";
import { database } from "../firebase";
import { app } from "../firebase";

import { Icon } from "@iconify/react";

import {
  doc,
  Timestamp,
  arrayUnion,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";

import { AuthContext } from "../context/AuthContext";
import { NotifyContext } from "../context/NotifyContext";

var socket = io("ws://localhost:5000", { transports: ["websocket"] });

socket.on("connect", function () {
  console.log("connected!");
});

const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const { notify, setNotify, userCallToYouId, setUserCallToYouId } =
    useContext(NotifyContext);
  const ID = Object.entries(data);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSetting = () => {};

  const navigate = useNavigate();
  const navigatevideocall = useNavigate();

  let videocallWindow;
  let videoReceiverCallWindown;

  const openVideocallWindow = () => {
    videocallWindow = window.open("/videocall", "_blank");
  };

  const openRecevierCallWindown = () => {
    videoReceiverCallWindown = window.open("/recevivercall", "_blank")
  }

  const handleVideoCall = async () => {
    if (currentUser && data) {
      try {
        const roomId = `${currentUser.uid}`; // Định nghĩa ID tài liệu tùy ý

        const roomReiverID = data.user.uid;

        const roomRef1 = doc(db, "chats", roomReiverID + "_signalR_");
        const roomRef2 = doc(db, "chats", roomId + "_signalC_"); // Tạo tham chiếu đến tài liệu mới

        // Đưa dữ liệu vào tài liệu mới
        await setDoc(roomRef1, {
          messages: [
            {
              id: uuidv4(),
              text: "",
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: `${ID[0][1].uid}`,
              senderName: currentUser.displayName,
            },
          ],
          call: true,
          acceptCall: null,
          callerId: currentUser.uid,
          receiverId: data.user.uid,
          // Các thuộc tính khác của tài liệu nếu có
        });
        await setDoc(roomRef2, {
          messages: [
            {
              id: uuidv4(),
              text: "",
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: `${ID[0][1].uid}`,
              senderName: currentUser.displayName,
            },
          ],
          call: true,
          acceptCall: null,
          callerId: currentUser.uid,
          receiverId: data.user.uid,
        });
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: data.chatId,
            text: "Chat Video",
            callerId: currentUser.uid,
            receiverId: data.user.uid,
            date: Timestamp.now(),
            call: true,
            acceptCall: null,
          }),
        });

        // const callNotificationRef = ref(
        //   database,
        //   `call_notifications/${data.user.uid}`
        // );

        // const callNotification = {
        //   callerId: currentUser.uid,
        //   timestamp: serverTimestamp(),
        // };

        // push(callNotificationRef, callNotification);

        // Lưu data ở trình duyệt
        const saveDataToLocalStorage = (key, data) => {
          localStorage.setItem(key, JSON.stringify(data));
        };
        saveDataToLocalStorage("Data", data);
      } catch (error) {
        console.error("Error creating chat document:", error);
      }

      // navigate("/videocall");

      // window.open("/videocall", "_blank");

      openVideocallWindow();

      // window.location.reload();
    }
  };

  const handleDeleteRoom = async () => {
    try {
      const roomIdR = currentUser.uid + "_signalR_";
      const roomRefR = doc(db, "chats", roomIdR);

      const roomIdC = userCallToYouId + "_signalC_";
      const roomRefC = doc(db, "chats", roomIdC);

      await deleteDoc(roomRefR);
      await deleteDoc(roomRefC);

      setNotify(false);


     
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleUpdateAcceptCall = async () => {};

  // const getDataFromLocalStorage = (key) => {
  //   const data = localStorage.getItem(key);
  //   return data ? JSON.parse(data) : null;
  // };

  // const retrievedData = getDataFromLocalStorage("Data");
  // console.log(retrievedData);

  const [userCallToYou, setUserCallToYou] = useState(null);

  const handleGetDataUserToCall = async () => {
    if (userCallToYouId) {
      const roomID = userCallToYouId;
      const roomRef = doc(db, "users", roomID);
      try {
        // Lấy dữ liệu từ tham chiếu
        const roomSnapshot = await getDoc(roomRef);

        if (roomSnapshot.exists()) {
          // Dữ liệu tài liệu tồn tại
          const roomData = roomSnapshot.data();

          if (roomData) {
            setUserCallToYou(roomData);
          }
        } else {
          console.log("Tài liệu không tồn tại.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ tham chiếu:", error);
      }
    }
  };

  handleGetDataUserToCall();

  // Nhận cuộc gọi

  const handleRecevierCall  = async () => {
    // if (currentUser) {
    //   const roomID =  currentUser.uid + "_signalR_";
    //     const roomRef = doc(db, "chats", roomID);
    //     await setDoc(roomRef, { socketId: socket.id }, { merge: true });
    //     console.log("Tài liệu đã được cập nhật hoặc tạo mới thành công!");
    // }
    openRecevierCallWindown()
  }

  return (
    <div className="w-3/4 relative">
      <div className="flex justify-between items-center h-[8%] bg-indigo-200 px-2 py-2 text-indigo-800 font-semibold z-10">
        <span>{data.user?.displayName}</span>
        {ID[0][1].uid && (
          <div className="flex w-24 justify-between">
            <div>
              <Icon
                className="text-lg cursor-pointer"
                icon="streamline:webcam-video-solid"
                onClick={() => handleVideoCall()}
              />
            </div>

            <div>
              <Icon
                className="text-lg cursor-pointer"
                icon="arcticons:open"
                onClick={() => {
                  setIsOpenModal(true);
                }}
              />
            </div>
            <div>
              <Icon
                className="text-lg cursor-pointer"
                icon="mdi:people-add-outline"
              />
            </div>
          </div>
        )}
      </div>
      {isOpenModal ? (
        <div className="text-white bg-indigo-300 px-3 py-1 rounded-md absolute right-1  top-[9%]">
          <div
            className="cursor-pointer hover:text-indigo-600 my-1"
            onClick={() => handleToggleDarkMode()}
          >
            {!darkMode ? "Dark Mode" : "Light Mode"}
          </div>
          <div className="cursor-pointer hover:text-indigo-600  my-1">
            Báo cáo
          </div>
          <div className="cursor-pointer hover:text-indigo-600  my-1">
            Chia sẻ
          </div>
        </div>
      ) : (
        ""
      )}
      <Messages
        darkMode={darkMode}
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
      {ID[0][1].uid && <InputMessage />}

      {notify && (
        <div className=" absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center flex-col">
          <div className="flex bg-white justify-center items-center flex-col p-4">
            <div className="flex justify-center items-center flex-col">
              <div className="flex justify-center items-center flex-col">
                <img
                  className="w-20 h-20 rounded-full"
                  src={userCallToYou?.photoURL}
                />
                <div className="flex my-4 justify-center items-center">
                  <div className="text-xl font-bold mr-2">
                    {userCallToYou?.displayName}
                  </div>
                  <span className="font-semibold text-sm">
                    đang gọi tới bạn
                  </span>
                </div>
              </div>
              <div>Cuộc gọi sẽ bắt đầu khi bạn vừa bắt máy</div>
              {/* <div className="flex text-3xl ml-2 square text-red-400 ">
                <iconify-icon icon="humbleicons:phone-call"></iconify-icon>
              </div> */}
            </div>
            <div className="flex w-[120px] justify-between mt-4">
              <div
                className="w-10 h-10 rounded-full bg-red-500 flex justify-center items-center text-rose-300 text-5xl cursor-pointer hover:text-rose-100"
                onClick={() => {
                  handleDeleteRoom();
                }}
              >
                <iconify-icon icon="carbon:close-filled"></iconify-icon>
              </div>
              <div
                className="w-10 h-10 rounded-full bg-emerald-400 flex justify-center items-center text-white text-3xl cursor-pointer hover:bg-emerald-300 "
                onClick={() => {
                  handleRecevierCall()
                }}
              >
                <iconify-icon icon="ic:baseline-phone"></iconify-icon>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
