

import React from "react";
import {useContext} from 'react'
import VideoPlayer from "../components/VideoPlayer";
import { ChatContext } from "../context/ChatContext";

export default function VideoCall() {

  const { data } = useContext(ChatContext);

  return (
    <div className="w-screen h-screen justify-center items-center">
      <VideoPlayer />
    </div>
  );
}
