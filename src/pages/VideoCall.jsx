// import React, { useState, useRef, useEffect, useContext } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer";
// import { AuthContext } from "../context/AuthContext";
// import { ChatContext } from "../context/ChatContext";

// const socket = io.connect("http://localhost:5000");

// export default function VideoCall() {
//   const [me, setMe] = useState("");
//   const [stream, setStream] = useState();
//   const [receivingCall, setReceivingCall] = useState(false);
//   const [caller, setCaller] = useState("");
//   const [callerSignal, setCallerSignal] = useState();
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [idToCall, setIdToCall] = useState("");
//   const [callEnded, setCallEnded] = useState(false);
//   const [name, setName] = useState("");
//   const myVideo = useRef();
//   const userVideo = useRef();
//   const connectionRef = useRef();

//   const { currentUser } = useContext(AuthContext);
//   const { data } = useContext(ChatContext);

//   const userBeingCall = Object.entries(data);

//   useEffect(() => {
//     setMe(userBeingCall[0][1].uid);
//     setIdToCall(userBeingCall[0][1].uid);
//     setCaller(userBeingCall[0][1].uid)
//   }, [me]);

//   useEffect(() => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         setStream(stream);
//         if (myVideo.current) {
//           myVideo.current.srcObject = stream;
//         }
//       });

//     socket.on("connect" ,() => {
//       console.log("Connect server!")
//     })

//     socket.on("connect_error", (error) => {
//       console.error("Connection error:", error);
//     });

//     socket.on("me", (id) => {
//       setMe(id);
//     });

//     socket.on("callUser", (data) => {
//       setReceivingCall(true);
//       setCaller(data.from);
//       setName(data.name);
//       setCallerSignal(data.signal);
//     });
//   }, []);

//   const callUser = (id) => {
//     const peer = new Peer({
//       initiator: true,
//       trickle: false,
//       stream: stream,
//     });
//     peer.on("signal", (data) => {
//       socket.emit("callUser", {
//         userToCall: id,
//         signalData: data,
//         from: me,
//         name: name,
//       });
//     });
//     peer.on("stream", (stream) => {
//       userVideo.current.srcObject = stream;
//     });
//     socket.on("callAccepted", (signal) => {
//       setCallAccepted(true);
//       peer.signal(signal);
//     });

//     connectionRef.current = peer;
//   };

//   const answerCall = () => {
//     setCallAccepted(true);
//     const peer = new Peer({
//       initiator: false,
//       trickle: false,
//       stream: stream,
//     });
//     peer.on("signal", (data) => {
//       socket.emit("answerCall", { signal: data, to: caller });
//     });
//     peer.on("stream", (stream) => {
//       userVideo.current.srcObject = stream;
//     });

//     peer.signal(callerSignal);
//     connectionRef.current = peer;
//   };

//   const leaveCall = () => {
//     setCallEnded(true);
//     connectionRef.current.destroy();
//   };

//   return (
//     <>
//       <h1 style={{ textAlign: "center", color: "#fff" }}>Zoomish</h1>
//       <div className="container">
//         <div className="video-container">
//           <div className="video">
//             {stream && (
//               <video
//                 playsInline
//                 muted
//                 ref={myVideo}
//                 autoPlay
//                 style={{ width: "600px" }}
//               />
//             )}
//           </div>
//           <div className="video">
//             {callAccepted && !callEnded ? (
//               <video
//                 playsInline
//                 ref={userVideo}
//                 autoPlay
//                 style={{ width: "300px" }}
//               />
//             ) : null}
//           </div>
//         </div>
//         <div className="myId">
//           <input
//             id="filled-basic"
//             label="Name"
//             variant="filled"
//             value={currentUser.displayName}
//             style={{ marginBottom: "20px" }}
//           />

//           <input
//             id="filled-basic"
//             label="ID to call"
//             variant="filled"
//             value={idToCall}
//             onChange={(e) => setIdToCall(e.target.value)}
//           />
//           <div className="call-button">
//             {callAccepted && !callEnded ? (
//               <button variant="contained" color="secondary" onClick={leaveCall}>
//                 End Call
//               </button>
//             ) : (
//               <div
//                 className="text-3xl cursor-pointer text-white"
//                 onClick={() => {
//                   callUser(idToCall);
//                 }}
//               >
//                 <iconify-icon icon="ic:baseline-phone"></iconify-icon>
//               </div>
//             )}
//           </div>
//         </div>
//         <div>
//           {receivingCall && !callAccepted ? (
//             <div className="caller">
//               <h1>{currentUser.displayName} is calling...</h1>
//               <button variant="contained" color="primary" onClick={answerCall}>
//                 Answer
//               </button>
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </>
//   );
// }

import React from 'react'
import VideoPlayer from '../components/VideoPlayer'
import Options from '../components/Options'
import Notifications from '../components/Notifications'

export default function VideoCall() {
  return (
    <div>
      <VideoPlayer/>
      <Options>
      </Options>
        <Notifications/>
    </div>
  )
}
