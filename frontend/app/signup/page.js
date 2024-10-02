'use client';
import Image from 'next/image';
import useSignUp from '../hooks/useSignUp';
import {
    InputDate,
    InputPassword,
    InputRadioButton,
    InputSubmit,
    InputText,
} from '../components/login_signup';
import useSWR from 'swr';
import Link from 'next/link';

export default function SignIn() {
    const SUBMIT_LABEL = 'Đăng ký';
    const SURNAME_LABEL = 'Họ + Tên Đệm';
    const GIVEN_NAME_LABEL = 'Tên chính';
    const BIRTH_LABEL = 'Ngày sinh';
    const FEMALE_LABEL = 'Nữ';
    const MALE_LABEL = 'Nam';
    const EMAIL_LABEL = 'Email của trường';
    const PASSWORD_LABEL = 'Mật khẩu';
    const REPASSWORD_LABEL = 'Nhập lại mật khẩu';

    const { formData, formValidation, formError, handleChange, handleSubmit } =
        useSignUp();
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
                    Đăng ký
                </h1>
                <div className="flex flex-col justify-center items-center space-y-3">
                    <div className="flex flex-row space-x-1 w-full">
                        <InputText
                            name={'surname'}
                            onChangeEvent={handleChange}
                            label={SURNAME_LABEL}
                            isValid={formValidation.surname}
                        />
                        <InputText
                            name="givenName"
                            onChangeEvent={handleChange}
                            label={GIVEN_NAME_LABEL}
                            isValid={formValidation.givenName}
                        />
                    </div>

                    <InputDate
                        name={'birthday'}
                        onChangeEvent={handleChange}
                        label={BIRTH_LABEL}
                        isValid={formValidation.birthday}
                    />
                    <div className="w-full">
                        <h2 className="text-white mt-2 mb-1 text-sm">
                            Giới tính
                        </h2>
                        <div className="w-full flex flex-row space-x-1">
                            <InputRadioButton
                                name={'gender'}
                                onChangeEvent={handleChange}
                                label={MALE_LABEL}
                                value={'male'}
                                isValid={formValidation.gender}
                            />
                            <InputRadioButton
                                name={'gender'}
                                onChangeEvent={handleChange}
                                label={FEMALE_LABEL}
                                value={'female'}
                                isValid={formValidation.gender}
                            />
                        </div>
                    </div>

                    <InputText
                        name={'email'}
                        onChangeEvent={handleChange}
                        label={EMAIL_LABEL}
                        isValid={formValidation.email}
                    />
                    <InputPassword
                        name={'password'}
                        onChangeEvent={handleChange}
                        label={PASSWORD_LABEL}
                        isValid={formValidation.password}
                    />
                    <InputPassword
                        name={'repassword'}
                        onChangeEvent={handleChange}
                        label={REPASSWORD_LABEL}
                        isValid={formValidation.repassword}
                    />
                    <p className="text-sm text-red-400 md:text-base">
                        {formError}
                    </p>
                    <InputSubmit label={SUBMIT_LABEL} />
                </div>
            </form>
        </div>
    );
}
