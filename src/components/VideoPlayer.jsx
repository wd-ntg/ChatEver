import React, { useContext, useState, useEffect } from "react";
import { Grid, Typography, Paper, makeStyles } from "@material-ui/core";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { SocketContext } from "../context/SocketIOContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  video: {
    width: "550px",
    [theme.breakpoints.down("xs")]: {
      width: "300px",
    },
  },
  gridContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px",
  },
}));

const VideoPlayer = () => {
  const {
    name,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,
    call,
    setMe,
    me,
  } = useContext(SocketContext);
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const classes = useStyles();

  const [userName, setUserName] = useState(""); 

  const navigateFromVideoCall = async () => {
    try {
      if (currentUser.uid) {
        const roomRef = doc(db, "chats", currentUser.uid);
        const roomSnapshot = await getDoc(roomRef);
        if (roomSnapshot.exists()) {
        } else {
          navigate("/home");
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error fetching 'chats' data:", error);
    }
  };

  navigateFromVideoCall();

  setInterval(() => {
    navigateFromVideoCall();
  }, 20000);

  return (
    <Grid container className={classes.gridContainer}>
      {true && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {name || "Name"}
            </Typography>
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className={classes.video}
            />
          </Grid>
        </Paper>
      )}
      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {call.name || "Name"}
            </Typography>
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className={classes.video}
            />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};

export default VideoPlayer;
