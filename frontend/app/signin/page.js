"use client";
import Image from "next/image";
import useSignIn from "../hooks/useSignIn";
import {
    InputPassword,
    InputSubmit,
    InputText,
} from "../components/login_signup";
import useSWR from "swr";
import Link from "next/link";

export default function SignIn() {
    const {
        email,
        password,
        error,
        loading,
        validateEmail,
        validatePassword,
        handlePasswordChange,
        handleEmailChange,
        handleSubmit,
    } = useSignIn();
    const SUBMIT_LABEL = "Đăng nhập";
    const PASSWORD_LABEL = "Mật khẩu";
    const EMAIL_LABEL = "Email đăng nhập";
    return (
        <div className="relative w-screen h-screen">
            <Image
                src="/background-login.png"
                fill
                sizes="100vw"
                alt="background-login-hcmue"
                quality={100}
                style={{ objectFit: "contain" }}
            />
            <form
                className="inline-block w-full text-sm relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg p-10 bg-slate-600 hover:shadow-lg hover:shadow-slate-500/50  md:w-5/6 lg:w-1/3 lg:text-base "
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <h1 className="text-white text-4xl font-bold text-center mb-6">
                    Đăng nhập
                </h1>{" "}
                <div className="flex flex-col justify-center items-center space-y-3">
                    <InputText
                        name="email"
                        onChangeEvent={handleEmailChange}
                        label={EMAIL_LABEL}
                        isValid={validateEmail}
                        value={email}
                    />
                    <InputPassword
                        name="password"
                        onChangeEvent={handlePasswordChange}
                        label={PASSWORD_LABEL}
                        isValid={validatePassword}
                        value={password}
                    />{" "}
                    <p className="text-red-400">{error}</p>
                    <InputSubmit
                        label={loading ? "Đang xử lý..." : SUBMIT_LABEL}
                        disabled={loading}
                    />
                </div>
                <p className="text-white mt-2 text-base">
                    Hoặc
                    <Link href="/signup" className="text-blue-300">
                        {" "}
                        Đăng ký
                    </Link>
                </p>
            </form>
        </div>
    );
}
