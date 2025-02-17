'use client';
import { useState } from 'react';

import {isCorrectEmail, isFalsyValue, isPasswordMatchRepassword} from '../utils';
export default function useSignUp() {

    const [formData, setFormData] = useState({
        password: null,
        repassword: null,
        surname: null,
        givenName: null,
        email: null,
        birthday: null,
        gender: null,
    });
    const [formValidation, setFormValidation] = useState({
        password: false,
        repassword: false,
        surname: false,
        givenName: false,
        email: false,
        birthday: false,
        gender: false,
    });
    const [formError, setFormError] = useState(null);
    const errorEmptyInput = 'Vui lòng nhập hết tất cả trường dữ liệu!';
    const errorEmailStructure = 'Email phải do trường HCMUE cung cấp!';
    const errorPasswordMismatch = 'Mật khẩu không khớp!';
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value.trim(),
        }));
        setFormValidation((prevData) => ({
            ...prevData,
            [name]: Boolean(value.trim()),
        }));
    };
    const fetchDataBackend = async () =>{
        debugger;
        try{ 
            const copyFormData = JSON.parse(JSON.stringify(formData));
            delete copyFormData.repassword;
            const response = await fetch(process.env.NEXT_PUBLIC_FQDN_BACKEND + "/auth/signUp",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(copyFormData)
            })
            if (!response.ok) {
                // If not successful, parse the error message from the response
                const errorData = await response.json();
                throw new Error(errorData.message || "Something went wrong");
            }
            // BUG: JSON.parse: unexpected character at line 1 column 1 of the JSON data
        }catch(e){
            console.error(e);
            return e.message;
        }
    }
    const handleSubmit = async (e) => {
        if (isFalsyValue(formData)) {
            setFormError(errorEmptyInput);
            return;
        }
        if (!isCorrectEmail(formData.email)) {
            setFormError(errorEmailStructure);
            return;
        }
        if (
            !isPasswordMatchRepassword(
                formData.password,
                formData.repassword,
            )
        ) {
            setFormError(errorPasswordMismatch);
            return;
        }
        const message = await fetchDataBackend();
        console.log(message);
        // setFormError(message.message);
    };
    return {
        formData,
        formValidation,
        formError,
        handleChange,
        handleSubmit,
    };
}
