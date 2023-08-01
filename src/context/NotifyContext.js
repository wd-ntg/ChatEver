import React, { createContext, useContext, useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { AuthContext } from "./AuthContext";

const NotifyContext = createContext();

const NotifyContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  const [notify, setNotify] = useState(false);
  const [userCall, setUserCall] = useState("");
  const [deleteCallUser, setDeleteCallUser] = useState("")

  const notifyVideoCall = async () => {
    try {
      const chatsRef = collection(db, "chats");

      const q = query(chatsRef, where("call", "==", true));

      const querySnapshot = await getDocs(q);

      const chatsWithCallTrue = querySnapshot.docs.map((doc) => doc.data());

      if (chatsWithCallTrue) {
        if (currentUser.uid == chatsWithCallTrue[0].messages[0].img) {
            setNotify(true);
            setUserCall(chatsWithCallTrue[0].messages[0].senderName);
            setDeleteCallUser(chatsWithCallTrue[0].messages[0].senderId)
          }
      } else {
        setNotify(false)
      }

      return chatsWithCallTrue;
    } catch (error) {
      console.error("Error getting chats data:", error);
    }
  };

  notifyVideoCall();

  const fetchData = () => {
    notifyVideoCall();
  };

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(() => {
//       fetchData();
//     }, 20000);
//     return () => clearInterval(interval);
//   }, []);


  return (
    <NotifyContext.Provider
      value={{ notify, setNotify, userCall, setUserCall, deleteCallUser, setDeleteCallUser }}
    >
      {children}
    </NotifyContext.Provider>
  );
};

export { NotifyContext, NotifyContextProvider };
