import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { ChatContext } from "../context/ChatContext";

const Chats = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <>
      <div className="border-t-[1px] border-stone-400 border-solid bg-indigo-400 h-[83%]">
        {Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <div
              className="userChat flex items-center my-4 mx-2 "
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            >
              {chat[1].userInfo ? (
                <>
                  <img
                    className="w-12 h-12 rounded-[50%] object-cover mr-1"
                    src={chat[1].userInfo.photoURL}
                    alt=""
                  />
                  <div className="userChatInfo flex flex-col items-center text-left ml-2 max-w-[232px] relative">
                    <div className="w-full">{chat[1].userInfo.displayName}</div>
                    <div className="text-sm text-left text-white max-w-[172px] truncate w-[132px]">
                      {chat[1].lastMessage?.text}
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default Chats;
