'use client'
import Image from "next/image"
import useLogin from "../hooks/useLogin"
import { InputPassword, InputSubmit, InputText } from "../components/login_signup";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Login(){
    const {
        email,
        password,
        handlePasswordChange,
        handleEmailChange,
        validateCredentials,
        isClickInput
    } = useLogin();
    const SUBMIT_LABEL = "Đăng nhập";        
    const PASSWORD_LABEL = "Mật khẩu";
    const TEXT_LABEL = "Email đăng nhập";
    const ERROR_CREDENTIALS = "Email và mật khẩu không được bỏ trống";
    const errorCondition = ( !validateCredentials() && isClickInput ) ? ERROR_CREDENTIALS : "";


    // const { data, error } = useSWR('/api/profile-data', fetcher)
 
    // if (error) return <div>Failed to load</div>
    // if (!data) return <div>Loading...</div>
    return (
        <div className="relative w-screen h-screen">
            <Image 
                src="/background-login.png"
                fill
                sizes="100vw"
                alt="background-login-hcmue"
                quality={100}
                style={{objectFit: 'contain'}}
            />
            <form className="inline-block relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg p-10 bg-slate-600 hover:shadow-lg hover:shadow-slate-500/50 w-5/6 lg:w-1/3 " >
                <div className="flex flex-col justify-center items-center space-y-3">
                    <InputText 
                        onChangeEvent={handleEmailChange} 
                        labelInputText={TEXT_LABEL}
                    />
                    <InputPassword 
                        onChangeEvent={handlePasswordChange}
                        labelInputPassword={PASSWORD_LABEL}
                     />
                     <p className="text-red-400">{errorCondition}</p>
                    <InputSubmit submitLabel={SUBMIT_LABEL}/>
                </div>
            </form>
        </div>
    )
}