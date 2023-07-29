import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import AddImg from "../img/addAvatar.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";

const InputMessage = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);

  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      if (text == "") return;
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  const handleCloseImg = () => {
    setImg(null)
  }

  return (
    <div className="flex items-center bg-white absolute bottom-0 w-full">
      <input
        className="w-4/6 h-12 outline-none px-2 rounded-lg"
        type="text"
        placeholder="Nhập tin nhắn"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="w-1/6">
        {img && (
          <div className="flex items-center">
            <div className="flex items-center">
              <img className="w-8 h-8" src={AddImg} />
              <div className="ml-2 text-indigo-600 max-w-[72px] truncate">{img.name}</div>
            </div>
            <div className="translate-y-[-6px] ml-2 text-indigo-300 hover:text-red-500" onClick={() => handleCloseImg()}>
              <iconify-icon icon="carbon:close-outline"></iconify-icon>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center w-1/6 justify-center relative">
        <img className="w-6 h-6" src={Attach} alt="" />
        <input
          type="file"
          className="hidden"
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img className="w-6 h-6 mx-2" src={Img} alt="" />
        </label>
        <div
          className="text-2xl text-indigo-700 flex items-center mx-2 cursor-pointer"
          onClick={handleSend}
        >
          <iconify-icon icon="tabler:send"></iconify-icon>
        </div>
      </div>
    </div>
  );
};

export default InputMessage;
