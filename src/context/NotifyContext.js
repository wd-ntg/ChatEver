import React, { createContext, useContext, useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { onSnapshot, query } from "firebase/firestore";

import { db, storage } from "../firebase";
import { AuthContext } from "./AuthContext";
import { ChatContext } from "./ChatContext";

const NotifyContext = createContext();

const NotifyContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  const { data } = useContext(ChatContext);

  const [notify, setNotify] = useState(false);

  const [userCallToYouId, setUserCallToYouId] = useState(null);

  
  const [stateWindow, setStateWindow] = useState(false);


  // const notifyVideoCall = async () => {
  //   try {
  //     const chatsRef = collection(db, "chats");
  //     const q = query(chatsRef, where("call", "==", true));
  //     const querySnapshot = await getDocs(q);
  //     const chatsWithCallTrue = querySnapshot.docs.map((doc) => doc.data());
  //     if (chatsWithCallTrue) {
  //       if (currentUser.uid == chatsWithCallTrue[0].messages[0].img) {
  //           setNotify(true);
  //           setUserCall(chatsWithCallTrue[0].messages[0].senderName);
  //           setDeleteCallUser(chatsWithCallTrue[0].messages[0].senderId)
  //         }
  //     } else {
  //       setNotify(false)
  //     }
  //     return chatsWithCallTrue;
  //   } catch (error) {
  //     console.error("Error getting chats data:", error);
  //   }
  // };

  // notifyVideoCall();

  // const fetchData = () => {
  //   notifyVideoCall();
  // };

  //   useEffect(() => {
  //     fetchData();
  //     const interval = setInterval(() => {
  //       fetchData();
  //     }, 20000);
  //     return () => clearInterval(interval);
  //   }, []);

  // New noty

  // const [notifications, setNotifications] = useState([]);

  //   useEffect(() => {
  //     const realtimeRef = ref(getDatabase(), `chats/${currentUser.uid}/notifications`);

  //     const unsubscribe = onValue(realtimeRef, (snapshot) => {
  //       if (snapshot.exists()) {
  //         const data = snapshot.val();
  //         const notificationArray = Object.values(data);
  //         setNotifications(notificationArray);
  //       }
  //     });

  //     return () => {
  //       // Hủy đăng ký lắng nghe khi component unmount
  //       unsubscribe();
  //     };
  //   }, [currentUser.uid]);

  // const [messages, setMessages] = useState([]);
  // useEffect(() => {
  //   const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
  //     doc.exists() && setMessages(doc.data().messages);
  //     if (messages !== null) {
  //       if (messages[messages.length - 1]?.text === "Chat Video") {
  //         setNotify(true);
  //       } else {
  //         setNotify(false);
  //       }
  //     }
  //   });

  //   return () => {
  //     unSub();
  //   };
  // }, [data.chatId]);
  // useEffect(() => {
  //   if (messages !== null) {
  //     if (messages[messages.length - 1]?.text === "Chat Video") {
  //       setNotify(true);
  //     } else {
  //       setNotify(false);
  //     }
  //   }
  // }, [messages]);

  const noty = () => {
    if (currentUser) {
      const roomID = currentUser.uid;
      if (roomID) {
        const roomRef = doc(db, "chats", roomID + "_signalR_");

        const unsubscribe = onSnapshot(roomRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setNotify(true);
          } else {
            setNotify(false);
          }
        });

        return () => {
          // Hủy đăng ký lắng nghe khi component unmount
          unsubscribe();
        };
      }
    }
  };

  // const noty = () => {
  //   if (currentUser.uid && data.user.uid) {
  //     const roomID = data.user.uid+"_call_signal" + currentUser.uid;
  //     // Tạo một truy vấn với điều kiện tìm kiếm
  //     const q = query(
  //       collection(db, "chats"),
  //       where("roomId", ">=", roomID),
  //       where("roomId", "<=", roomID + "\uf8ff")
  //     );

  //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //       // Kiểm tra xem có bất kỳ tài liệu nào phù hợp với điều kiện không
  //       if (!querySnapshot.empty) {
  //         const firstDocumentData = querySnapshot.docs[0].data();
  //         console.log("Found document data:", firstDocumentData);
  //         setNotify(true);
  //       } else {
  //         setNotify(false);
  //       }
  //     });

  //     return () => {
  //       // Hủy đăng ký lắng nghe khi component unmount
  //       unsubscribe();
  //     };
  //   }
  // };

  // Gọi hàm để bắt đầu lắng nghe sự thay đổi
  noty();

  const stateWindowCO = async () => {
    if (currentUser) {
      const roomID = currentUser.uid;
      if (roomID) {
        const roomRef = doc(db, "chats", roomID + "_signalC_");

        const unsubscribe = onSnapshot(roomRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setStateWindow(true)
          } else {
            setStateWindow(false)
          }
        });

        return () => {
          // Hủy đăng ký lắng nghe khi component unmount
          unsubscribe();
        };
      }
    }
  }

  stateWindowCO()

  const handleUserCallToYou = async () => {
    if (currentUser) {
      const roomID = currentUser.uid + "_signalR_";
      const roomRef = doc(db, "chats", roomID);
      try {
        // Lấy dữ liệu từ tham chiếu
        const roomSnapshot = await getDoc(roomRef);

        if (roomSnapshot.exists()) {
          // Dữ liệu tài liệu tồn tại
          const roomData = roomSnapshot.data();
          if (roomData) {
            setUserCallToYouId(roomData.callerId)
          }
        } else {
          console.log("Tài liệu không tồn tại.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ tham chiếu:", error);
      }
    }
  };

  handleUserCallToYou()

  // console.log(userCallToYouId)

  return (
    <NotifyContext.Provider
      value={{
        notify,
        setNotify,
        userCallToYouId,
        setUserCallToYouId,
        stateWindow, setStateWindow
      }}
    >
      {children}
    </NotifyContext.Provider>
  );
};

export { NotifyContext, NotifyContextProvider };
