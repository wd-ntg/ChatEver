import React, { useState } from "react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import AddAvatar from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import { auth, storage, db } from "../firebase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleRegister = async () => {
    if (confirmPassword != password) {
      alert("Đăng ký thất bại!");
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const date = new Date().getTime();
        const storageRef = ref(storage, `${displayName + date}`);

        await uploadBytesResumable(storageRef, selectedFile).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            try {
              //Update profile
              await updateProfile(userCredential.user, {
                displayName,
                photoURL: downloadURL,
              });
              //create user on firestore
              await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                displayName,
                email,
                photoURL: downloadURL,
              });

              //create empty user chats on firestore
              await setDoc(doc(db, "userChats", userCredential.user.uid), {});
              navigate("/home"); // Navigate to the home page after successful registration
            } catch (err) {
              console.log(err);
              setError(true);
              setLoading(false);
            }
          });
        });
      } catch (error) {
        setError(true);
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // console.error(errorCode, errorMessage);
      }
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <main className="flex justify-center items-center h-[90%] flex-col">
        <div className="flex flex-col justify-center items-center p-4 bg-slate-300 rounded-md">
          <div className="text-xl mb-4 pt-2 text-white font-semibold">
            Đăng ký
          </div>
          <Input
            label="Địa chỉ Email"
            placeholder="Nhập Email"
            type="text"
            value={email}
            setValue={setEmail}
          ></Input>
          <Input
            label="Tên người dùng"
            placeholder="Nhập tên người dùng"
            type="text"
            value={displayName}
            setValue={setDisplayName}
          ></Input>
          <Input
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            type="password"
            value={password}
            setValue={setPassword}
          ></Input>
          <Input
            label="Xác nhận mật khẩu"
            placeholder="Nhập mật khẩu xác nhận"
            type="password"
            value={confirmPassword}
            setValue={setConfirmPassword}
          ></Input>
          <input
            className="hidden mt-4 w-full text-sm text-slate-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                     file:bg-violet-50 file:text-violet-700
                     hover:file:bg-violet-100"
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className="flex justify-center items-center mt-4"
          >
            <img src={AddAvatar} className="w-8 h-8 mr-2" alt="" />
            {!selectedFile ? (<span className="text-indigo-300">Thêm ảnh đại diện</span>) : (<span className="text-indigo-500">{selectedFile.name}</span>)}
          </label>
          <button
            className="text-violet-900 my-4 mt-6 px-2 py-1 rounded-md text-center flex justify-center items-center hover:text-violet-600 hover:bg-slate-100 transition duration-150 ease-out hover:ease-in"
            onClick={async (e) => {
              e.preventDefault();
              try {
                setLoading(true); // Show loading state while processing
                await handleRegister();
              } catch (err) {
                // Handle any errors here
                setLoading(false); // If an error occurs, reset loading state
              }
            }}
          >
            Sumbit
          </button>
        </div>
        {error && <div className="text-red-500">Đăng ký thất bại. Xin vui lòng thử lại!</div>}
        <div>
          <div className="translate-x-[-86px] mt-6 text-sm text-slate-500">
            Bạn đã có tài khoản?
          </div>
          <Link to="/login">
            <div className="flex justify-center items-center mt-4 ">
              <div className="mr-2 text-sm text-violet-600 hover:text-violet-300">
                Đăng nhập với
              </div>
              <div className=" font-semibold text-violet-400">Chat</div>
              <div className="ml-1 text-[10px] text-violet-700 font-semibold">
                Ever
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Register;
