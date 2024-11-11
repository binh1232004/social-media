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
    const handleSubmit = (e) => {
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
        // // // Handle form submission with formData
        console.log('Form Data:', formData);
    };

    return {
        formData,
        formValidation,
        formError,
        handleChange,
        handleSubmit,
    };
}
