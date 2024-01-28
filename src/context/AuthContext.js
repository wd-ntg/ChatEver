import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

import {
  doc,getDoc
} from "firebase/firestore";

import { db } from "../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [receiverUserId, setReciverUserId] = useState(null);

  const hanleFindReciverUser = async () => {
    if (currentUser ) {
      if (currentUser.uid) {
        const roomID = currentUser.uid+"_signalC_";
        const roomRef = doc(db, "chats", roomID);
        try {
          // Lấy dữ liệu từ tham chiếu
          const roomSnapshot = await getDoc(roomRef);

          if (roomSnapshot.exists()) {
            // Dữ liệu tài liệu tồn tại
            const roomData = roomSnapshot.data();
            // console.log(roomData)
            if (roomData) {
              setReciverUserId(roomData.receiverId)
            }
          } else {
            console.log("Tài liệu không tồn tại.");
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu từ tham chiếu:", error);
        }
      }
    }
  };
  
  hanleFindReciverUser();


  // console.log(receiverUserId)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, receiverUserId, setReciverUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
