import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      setError(true);
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // console.error(errorCode, errorMessage);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <main className="flex justify-center items-center h-[90%] flex-col">
        <div className="flex flex-col justify-center items-center p-4 bg-slate-300 rounded-md">
          <div className="text-xl mb-5 pt-4 text-white font-semibold">
            Đăng nhập
          </div>
          <Input
            label="Địa chỉ Email"
            placeholder="Nhập Email"
            type="text"
            value={email}
            setValue={setEmail}
          ></Input>
          <br />
          <Input
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            type="password"
            value={password}
            setValue={setPassword}
          ></Input>
          <button
            className="text-violet-900 my-4 mt-6 px-2 py-1 rounded-md text-center flex justify-center items-center hover:text-violet-600 hover:bg-slate-100 transition duration-150 ease-out hover:ease-in"
            onClick={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            Sumbit
          </button>
        </div>
        {error && <div className="text-red-400">Đăng nhập thất bại. Xin vui lòng thử lại!</div>}

        <div>
          <div className="translate-x-[-86px] mt-6 text-sm text-slate-500">
            Bạn chưa có tài khoản?
          </div>
          <Link to="/register">
            <div className="flex justify-center items-center mt-4 ">
              <div className="mr-2 text-sm text-violet-600 hover:text-violet-300">
                Đăng ký với
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

export default Login;
