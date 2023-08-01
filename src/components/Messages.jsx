import React, { useEffect, useState, useContext, useRef } from "react";
import Message from "./Message";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "../context/ChatContext";

const Messages = ({ darkMode, isOpenModal, setIsOpenModal }) => {
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);

  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div
      onScroll={() => {
        setIsScrolling(true);
      }}
      className={` h-[442px] flex flex-col px-4 ${
        isScrolling ? "overflow-y-scroll" : "overflow-hidden"
      } ${darkMode ? "dark_mode" : "bg-slate-200"}`}
      onClick={() => setIsOpenModal(false)}
    >
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
