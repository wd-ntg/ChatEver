import React, { useContext, useState } from "react";
import Cam from "../img/cam.png";
import More from "../img/more.png";
import Add from "../img/add.png";
import Messages from "./Messages";
import InputMessage from "./InputMessage";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [darkMode, setDarkMode] = useState(false)

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleSetting = () => {};

  return (
    <div
      className="w-3/4 relative"
    >
      <div className="flex justify-between items-center h-[8%] bg-indigo-200 px-2 py-2 text-indigo-800 font-semibold z-10">
        <span>{data.user?.displayName}</span>
        <div className="flex">
          <img
            className="w-8 h-8 mx-2 cursor-pointer hover:bg-indigo-300 rounded-lg"
            src={Cam}
            alt=""
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
      </div>
      {isOpenModal ? (
        <div className="text-white bg-indigo-300 px-3 py-1 rounded-md absolute right-1  top-[9%]">
          <div className="cursor-pointer hover:text-indigo-600 my-1" onClick={() => handleToggleDarkMode()}>
            {!darkMode ? "Dark Mode" : "Light Mode"}
          </div>
          <div className="cursor-pointer hover:text-indigo-600  my-1">
            Báo cáo
          </div>
          <div className="cursor-pointer hover:text-indigo-600  my-1">
            Chia sẻ
          </div>
        </div>
      ) : ""}
      <Messages darkMode={darkMode} isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal}/>
      <InputMessage />
    </div>
  );
};

export default Chat;
