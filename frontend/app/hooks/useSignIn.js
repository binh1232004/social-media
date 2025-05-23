'use client';
import { useState } from 'react';
import { setAuthToken } from '../utils/auth';
export default function useSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validateEmail, setValidateEmail] = useState(true);
  const [validatePassword, setValidatePassword] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
          setLoading(true);
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
              body: JSON.stringify(loginData),
              credentials: 'include' // Important for cookies to be sent/received
          });
          
          const data = await response.json();
            if (response.ok) {
              // Login successful
              console.log('Login successful:', data);
                // Log the full data to help identify where the token is
              console.log('Full login response data:', JSON.stringify(data, null, 2));
              
              // Look for token in various locations based on your API response
              const token = data.token || data.accessToken || data.access_token || 
                           (data.data && (data.data.token || data.data.accessToken || data.data.access_token));
                if (token) {
                  // The token is already saved in HTTP-only cookies by the backend
                  console.log('Login successful with token');
                  
                  // Store user information in localStorage if available in the response
                  if (data.userInfo) {
                      try {
                          localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
                          console.log('User info cached in localStorage');
                      } catch (e) {
                          console.error('Error storing user info:', e);
                      }
                  }
                  
                  setError('Đăng nhập thành công!');
                  
                  // Wait briefly to show success message
                  setTimeout(() => {
                      // Redirect to home page
                      window.location.href = '/home';
                  }, 1000);
              } else {
                  console.warn('Login successful but no token received', data);
                  setError('Đăng nhập thành công nhưng không nhận được token.');
              }
          } else {
              // Login failed
              setError(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
              console.error('Login failed:', data);
          }
      } catch (err) {
          console.error('Login error:', err);
          setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.');
      } finally {
          setLoading(false);
      }
  };  return {
      email,
      password,
      validateEmail,
      validatePassword,
      handleEmailChange,
      handlePasswordChange,
      error,
      loading,
      handleSubmit,
  };
}
