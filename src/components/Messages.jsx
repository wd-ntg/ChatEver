import React, { useEffect, useState, useContext, useRef } from "react";
import Message from "./Message";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "../context/ChatContext";
import { NotifyContext } from "../context/NotifyContext";

const Messages = ({ darkMode, isOpenModal, setIsOpenModal }) => {
  const { data } = useContext(ChatContext);
  const { notify, setNotify } = useContext(NotifyContext);

  const [messages, setMessages] = useState([]);

  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
      if (messages !== null) {
        if (messages[messages.length - 1]?.text === "Chat Video") {
          setNotify(true);
        } else {
          setNotify(false);
        }
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

//   useEffect(() => {
//   if (messages !== null) {
//     if (messages[messages.length - 1]?.text === "Chat Video") {
//       setNotify(true);
//     } else {
//       setNotify(false);
//     }
//   }
// }, [messages]);

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
