'use client';
import { useState } from 'react';
export default function useSignIn() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [validateEmail, setValidateEmail] = useState(false);
  const [validatePassword, setValidatePassword] = useState(false);
  const [error, setError] = useState(null);

  const errorEmptyInput = 'Vui lòng nhập hết tất cả trường dữ liệu!';
  const handleEmailChange = (e) => {
      const valueInput = e.target.value.trim();
      setEmail(valueInput);
      setValidateEmail(Boolean(valueInput));
  };
  const handlePasswordChange = (e) => {
      const valueInput = e.target.value.trim();
      setPassword(valueInput);
      setValidatePassword(Boolean(valueInput));
  };
  const handleSubmit = () => {
      if (!password || !email) {
          setError(errorEmptyInput);
          return;
      }
  };
  return {
      email,
      password,
      validateEmail,
      validatePassword,
      handleEmailChange,
      handlePasswordChange,
      error,
      handleSubmit,
  };
}
