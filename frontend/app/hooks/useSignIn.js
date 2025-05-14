'use client';
import { useState } from 'react';
export default function useSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validateEmail, setValidateEmail] = useState(true);
  const [validatePassword, setValidatePassword] = useState(true);
  const [error, setError] = useState('');

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
  };  const handleSubmit = async () => {
      // Clear any previous errors
      setError('');
      
      // Validate inputs
      if (!password || !email) {
          setError(errorEmptyInput);
          return;
      }
      
      try {
          // Show loading state
          setError('Đang đăng nhập...');
          
          // Prepare the login data
          const loginData = {
              email: email,
              password: password
          };
          
          console.log('Submitting login data:', loginData);
          
          // Make the API request
          const response = await fetch('/api/proxy/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(loginData)
          });
          
          const data = await response.json();
            if (response.ok) {
              // Login successful
              console.log('Login successful:', data);
              
              // Save token if present
              if (data.token) {
                  localStorage.setItem('token', data.token);
              }
              
              // Redirect to home page
              window.location.href = '/home';
          } else {
              // Login failed
              setError(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
              console.error('Login failed:', data);
          }
      } catch (err) {
          console.error('Login error:', err);
          setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.');
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
