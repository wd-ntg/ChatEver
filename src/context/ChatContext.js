import { createContext, useContext, useReducer, useState } from "react";
import { AuthContext } from "./AuthContext";

import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  // const [reciverUserId, setReciverUserId] = useState(null)

  // const hanleFindReciverUser = async () => {
  //   if (currentUser && reciverUser) {
  //     if (currentUser.uid && reciverUser.uid) {
  //       const roomID = currentUser.uid + reciverUser.uid;
  //       const roomRef = doc(db, "chats", roomID);
  //       try {
  //         // Lấy dữ liệu từ tham chiếu
  //         const roomSnapshot = await getDoc(roomRef);

  //         // const q = query(roomRef, where("call", "==", true));
  //         // const roomSnapshot = await getDocs(q);

  //         if (roomSnapshot.exists()) {
  //           // Dữ liệu tài liệu tồn tại
  //           const roomData = roomSnapshot.data();
  //           if (roomData.messages[roomData.messages.length-1].call == true) {
  //             setReciverUserId(roomData.messages[roomData.messages.length-1].receiverId)
  //           }
  //         } else {
  //           console.log("Tài liệu không tồn tại.");
  //         }
  //       } catch (error) {
  //         console.error("Lỗi khi lấy dữ liệu từ tham chiếu:", error);
  //       }
  //     }
  //   }
  // };
  // hanleFindReciverUser();
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };

      default:
        console.log("Unhandled action type: ", action.type);
        setReciverUser(state);
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider
      value={{ data: state, dispatch}}
    >
      {children}
    </ChatContext.Provider>
  );
};
