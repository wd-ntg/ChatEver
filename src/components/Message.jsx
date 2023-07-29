import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);

  const { data } = useContext(ChatContext);

  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({behavior: "smooth"})
  }, [message])

  return (
    <div ref={ref}
      className={`flex mb-6 ${
        message.senderId === currentUser.uid && " flex-row-reverse"
      }`}
    >
      <div className="mr-2 ml-2">
        <img
          className="w-6 h-6 rounded-[50%] object-cover"
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span className="text-[8px] text-indigo-600">Just Now</span>
      </div>
      <div className="">
        {message.text ? (
          <div
            className={`px-2 py-1 rounded-message bg-indigo-400 text-white mb-2 items-end max-w-[240px] ${
              message.senderId === currentUser.uid && `rounded-message-reverse bg-indigo-500`
            }`}
            style={{ wordWrap: 'break-word', wordBreak: 'break-all', maxWidth: "360px" }}
          >
            {message.text}
          </div>
        ) : (
          ""
        )}
        {message.img && (
          <img
            className="w-40 h-40 rounded-lg object-cover mt-2"
            src={message.img}
            alt=""
          />
        )}
      </div>
    </div>
  );
};

export default Message;
