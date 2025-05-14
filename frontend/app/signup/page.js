'use client';
import Image from 'next/image';
import useSignUp from '../hooks/useSignUp';
import {
    InputDate,
    InputPassword,
    InputRadioButton,
    InputSubmit,
    InputText,
    InputOTP,
} from '../components/login_signup';
import useSWR from 'swr';
import Link from 'next/link';

export default function SignUp() {
    const SUBMIT_LABEL = 'Đăng ký';
    const SURNAME_LABEL = 'Họ + Tên Đệm';
    const GIVEN_NAME_LABEL = 'Tên chính';
    const BIRTH_LABEL = 'Ngày sinh';
    const FEMALE_LABEL = 'Nữ';
    const MALE_LABEL = 'Nam';
    const EMAIL_LABEL = 'Email của trường';
    const PASSWORD_LABEL = 'Mật khẩu';
    const REPASSWORD_LABEL = 'Nhập lại mật khẩu';    const { 
        formData, 
        formValidation, 
        formError,
        formSuccess,
        isSubmitting, 
        showOtpForm,
        autoSubmitting,
        handleChange, 
        handleSubmit,
        resetOtpForm,
        handleOtpComplete
    } = useSignUp();
    return (
        <div className="relative w-screen h-screen">
            <Image
                src="/background-login.png"
                fill
                sizes="100vw"
                alt="background-login-hcmue"
                quality={100}
                style={{ objectFit: 'contain' }}
            />
            <form
                className="inline-block w-full relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm rounded-lg p-10 bg-slate-600 hover:shadow-lg hover:shadow-slate-500/50  md:w-5/6 lg:text-base lg:w-1/3 "
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <h1 className="text-white text-4xl font-bold text-center mb-6">
                    {showOtpForm ? 'Xác thực OTP' : 'Đăng ký'}
                </h1>
                <div className="flex flex-col justify-center items-center space-y-3">
                    {showOtpForm ? (
                        /* OTP Verification Form */
                        <>                <div className={`${autoSubmitting ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-700'} p-3 rounded-md w-full mb-2`}>
                                <p className="font-semibold">Email đã được đăng ký!</p>
                                <p className="text-sm">
                                    Vui lòng kiểm tra email của bạn để lấy mã xác thực OTP.
                                </p>
                                <p className="text-sm font-semibold mt-1">
                                    {autoSubmitting 
                                        ? 'Đang xác thực mã OTP...' 
                                        : 'Mã OTP sẽ tự động xác thực khi bạn nhập đủ 6 chữ số.'}
                                </p>
                            </div><InputOTP 
                                name={'otp'}
                                onChangeEvent={handleChange}
                                isValid={formValidation.otp}
                                value={formData.otp}
                                onComplete={handleOtpComplete}
                            />
                              
                            {autoSubmitting && (
                                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-2">
                                    <p className="text-sm md:text-base flex items-center justify-center">
                                        <span className="animate-spin mr-2">⟳</span> Đang xác thực OTP...
                                    </p>
                                </div>
                            )}
                              
                            {formError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    <p className="text-sm md:text-base">
                                        {formError}
                                    </p>
                                </div>
                            )}

                            {formSuccess && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    <p className="text-sm md:text-base flex items-center justify-center">
                                        <span className="mr-2">✓</span> {formSuccess}
                                    </p>
                                </div>
                            )}
                              <InputSubmit 
                                label={isSubmitting ? 'Đang xử lý...' : 'Xác thực OTP'} 
                                disabled={isSubmitting || autoSubmitting} 
                            />
                            
                            <button
                                type="button"
                                onClick={resetOtpForm}
                                className="text-white underline mt-2"
                                disabled={isSubmitting || autoSubmitting || formSuccess}
                            >
                                Quay lại chỉnh sửa thông tin
                            </button>
                        </>
                    ) : (
                        /* Initial Registration Form */
                        <>
                            <div className="flex flex-row space-x-1 w-full">                                <InputText
                                    name={'surname'}
                                    onChangeEvent={handleChange}
                                    label={SURNAME_LABEL}
                                    isValid={formValidation.surname}
                                    value={formData.surname}
                                />
                                <InputText
                                    name="givenName"
                                    onChangeEvent={handleChange}
                                    label={GIVEN_NAME_LABEL}
                                    isValid={formValidation.givenName}
                                    value={formData.givenName}
                                />
                            </div>                            <InputDate
                                name={'birthday'}
                                onChangeEvent={handleChange}
                                label={BIRTH_LABEL}
                                isValid={formValidation.birthday}
                                value={formData.birthday}
                            />
                            <div className="w-full">
                                <h2 className="text-white mt-2 mb-1 text-sm">
                                    Giới tính
                                </h2>
                                <div className="w-full flex flex-row space-x-1">                                    <InputRadioButton
                                        name={'gender'}
                                        onChangeEvent={handleChange}
                                        label={MALE_LABEL}
                                        value={'male'}
                                        isValid={formValidation.gender}
                                        checked={formData.gender === 'male'}
                                    />
                                    <InputRadioButton
                                        name={'gender'}
                                        onChangeEvent={handleChange}
                                        label={FEMALE_LABEL}
                                        value={'female'}
                                        isValid={formValidation.gender}
                                        checked={formData.gender === 'female'}
                                    />
                                </div>
                            </div>                            <InputText
                                name={'email'}
                                onChangeEvent={handleChange}
                                label={EMAIL_LABEL}
                                isValid={formValidation.email}
                                value={formData.email}
                            />
                            <InputPassword
                                name={'password'}
                                onChangeEvent={handleChange}
                                label={PASSWORD_LABEL}
                                isValid={formValidation.password}
                                value={formData.password}
                            />
                            <InputPassword
                                name={'repassword'}
                                onChangeEvent={handleChange}
                                label={REPASSWORD_LABEL}
                                isValid={formValidation.repassword}
                                value={formData.repassword}
                            />
                              {formError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    <p className="text-sm md:text-base">
                                        {formError}
                                    </p>
                                </div>
                            )}
                            
                            <InputSubmit 
                                label={isSubmitting ? 'Đang xử lý...' : SUBMIT_LABEL} 
                                disabled={isSubmitting} 
                            />
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}
