import React, { useContext } from "react";
import {signOut} from 'firebase/auth'
import {auth} from '../firebase'
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const {currentUser} = useContext(AuthContext)

  return (
    <div className="flex items-center justify-between px-2 py-2 bg-indigo-400 h-[10%]">
      <div className="flex">
        <div className=" font-semibold text-white">Chat</div>
        <div className="ml-1 text-[10px] text-white font-semibold">
          Ever
        </div>
      </div>
      <div className="flex items-center">
        <img className="w-6 h-6 rounded-[50%] object-cover mr-1" src={currentUser.photoURL} alt=""/>
        <span className="text-sm mr-2 text-white font-semibold">{currentUser.displayName}</span>
        <button className="hover:text-white text-sm hover:scale-105 text-indigo-100" onClick={() => signOut(auth)}>Đăng xuất</button>
      </div>
    </div>
  );
};

export default Navbar;
