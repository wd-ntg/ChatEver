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
import {
  doc,
  Timestamp,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc
} from "firebase/firestore";

import { AuthContext } from "../context/AuthContext";
import { NotifyContext } from "../context/NotifyContext";

const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { notify, setNotify, userCall, setUserCall, deleteCallUser } =
    useContext(NotifyContext);
  const ID = Object.entries(data);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSetting = () => {};

  const navigate = useNavigate();
  const navigatevideocall = useNavigate()

  const handleVideoCall = async () => {
    try {
      const roomId = `${currentUser.uid}`; // Định nghĩa ID tài liệu tùy ý
      const roomRef = doc(db, "chats", roomId); // Tạo tham chiếu đến tài liệu mới

      // Đưa dữ liệu vào tài liệu mới
      await setDoc(roomRef, {
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
        acceptCall: false
        // Các thuộc tính khác của tài liệu nếu có
      });
    } catch (error) {
      console.error("Error creating chat document:", error);
    }

    navigate("/videocall");

    window.location.reload();
  };

  const handleDeleteRoom = async () => {
    try {
      const roomId = `${deleteCallUser}`;
      const roomRef = doc(db, "chats", roomId); 
  
      await deleteDoc(roomRef);
    
      setNotify(false)
  
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleUpdateAcceptCall = async() => {
    
  }

  return (
    <div className="w-3/4 relative">
      <div className="flex justify-between items-center h-[8%] bg-indigo-200 px-2 py-2 text-indigo-800 font-semibold z-10">
        <span>{data.user?.displayName}</span>
        {ID[0][1].uid && (
          <div className="flex">
            <img
              className="w-8 h-8 mx-2 cursor-pointer hover:bg-indigo-300 rounded-lg"
              src={Cam}
              alt=""
              onClick={() => handleVideoCall()}
            />
            <img
              className="w-8 h-8 mx-2 cursor-pointer hover:bg-indigo-300 rounded-lg"
              src={More}
              alt=""
              onClick={() => {
                setIsOpenModal(true);
              }}
            />
            <img
              className="w-8 h-8 mx-2 cursor-pointer hover:bg-indigo-300 rounded-lg"
              src={Add}
              alt=""
            />
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
          <div className="flex items-center justify-center flex-col bg-indigo-200 px-4 py-6 rounded-md">
          <div className="flex items-center">
            <div className="text-indigo-600">{userCall} đang gọi tới bạn</div>
            <div className="flex text-3xl ml-2 square text-red-400 ">
              <iconify-icon icon="humbleicons:phone-call"></iconify-icon>
            </div>
          </div>
          <div className="flex w-[120px] justify-between mt-4">
            <div className="w-10 h-10 rounded-full bg-red-500 flex justify-center items-center text-rose-300 text-5xl cursor-pointer hover:text-rose-100" onClick={() => {handleDeleteRoom()}}>
              <iconify-icon icon="carbon:close-filled"></iconify-icon>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-400 flex justify-center items-center text-white text-3xl cursor-pointer hover:bg-emerald-300 " onClick={() => {handleVideoCall()}}>
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
