'use client';
import { useState } from 'react';

import {isCorrectEmail, isFalsyValue, isPasswordMatchRepassword} from '../utils';
export default function useSignUp() {    const [formData, setFormData] = useState({
        password: '',
        repassword: '',
        surname: '',
        givenName: '',
        email: '',
        birthday: '',
        gender: 'male', // Default gender to avoid empty value issues
        otp: '',
    });
    const [formValidation, setFormValidation] = useState({
        password: false,
        repassword: false,
        surname: false,
        givenName: false,
        email: false,
        birthday: false,
        gender: false,
        otp: false,
    });    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);
    const [autoSubmitting, setAutoSubmitting] = useState(false);
    const errorEmptyInput = 'Vui lòng nhập hết tất cả trường dữ liệu!';
    const errorEmailStructure = 'Email phải do trường HCMUE cung cấp!';
    const errorPasswordMismatch = 'Mật khẩu không khớp!';    const handleChange = (e) => {
        const { name, value } = e.target;
        
        console.log(`Field "${name}" changed to: "${value}"`);
        
        // Special validation for OTP field (numeric only)
        if (name === 'otp') {
            const numericValue = value.replace(/[^0-9]/g, '').trim();
            setFormData((prevData) => ({
                ...prevData,
                [name]: numericValue,
            }));
            setFormValidation((prevData) => ({
                ...prevData,
                [name]: numericValue.length === 6, // OTP should be 6 digits
            }));
        } else if (name === 'gender') {
            // Radio buttons need special handling
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
            setFormValidation((prevData) => ({
                ...prevData,
                [name]: Boolean(value),
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value.trim(),
            }));
            setFormValidation((prevData) => ({
                ...prevData,
                [name]: Boolean(value.trim()),
            }));
        }
    };// Step 1: Submit initial registration data and request OTP
    const requestOtp = async () => {
        try {
            const copyFormData = JSON.parse(JSON.stringify(formData));
            delete copyFormData.repassword;
            delete copyFormData.otp; // Remove OTP field for initial request            // Format the data to match your backend API requirements
            // Make sure to use the exact field names expected by the backend
            const userData = {
                username: copyFormData.email.split('@')[0], // Creating a username from email
                email: copyFormData.email,
                password: copyFormData.password,
                full_name: `${copyFormData.surname} ${copyFormData.givenName}`,
                birthday: copyFormData.birthday,
                gender: copyFormData.gender // Using the string value ("male" or "female")
            };
            
            // Make sure all required fields are present
            if (!userData.username || !userData.password) {
                throw new Error("Username and password are required fields");
            }
            
            // Log the exact data structure for debugging
            console.log("Registration data structure:", JSON.stringify(userData));
            
            console.log("Requesting OTP for registration:", userData);
            
            // Store data for the second step
            setRegistrationData(userData);
              // Call API to request OTP
            const response = await fetch(`/api/proxy/request-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    email: userData.email,
                    userName: userData.username // Adding userName field as required by API schema
                })
            });

            const data = await response.json();
            
            if (!response.ok && !data.success) {
                throw new Error(data.message || "Failed to send OTP. Please try again.");
            }
            
            // Show OTP form
            setShowOtpForm(true);
            return { success: true, message: "OTP has been sent to your email." };
        } catch(e) {
            console.error("OTP request error:", e);
            return { success: false, message: e.message };
        }
    };
      // Step 2: Submit registration with OTP verification
    const completeRegistration = async () => {
        try {
            if (!registrationData) {
                throw new Error("Không tìm thấy dữ liệu đăng ký. Vui lòng thử lại.");
            }
            
            if (!formData.otp || formData.otp.trim() === '') {
                throw new Error("Vui lòng nhập mã OTP từ email của bạn.");
            }              // Combine registration data with OTP
            // Make sure we structure the data exactly as expected by the backend
            const finalData = {
                username: registrationData.username,
                email: registrationData.email,
                password: registrationData.password,
                otp: formData.otp.trim(),
                full_name: registrationData.full_name,
                birthday: registrationData.birthday,
                gender: registrationData.gender
            };
            
            // Double-check that all required fields are present
            const requiredFields = ['username', 'password', 'otp'];
            const missingFields = requiredFields.filter(field => !finalData[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }
              console.log("Completing registration with OTP:", finalData);            // Use our own API route as a proxy to avoid CORS issues
            // Create a FormData object for multipart/form-data request
            const formDataObj = new FormData();
            
            // Add each field to the FormData object
            Object.entries(finalData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    formDataObj.append(key, value);
                }
            });
            
            console.log("Sending as multipart/form-data with fields:", Object.keys(finalData));
            
            const response = await fetch(`/api/proxy/register`, {
                method: 'POST',
                // Don't set Content-Type header, browser will set it automatically with boundary
                headers: {
                    'Accept': 'application/json'
                },
                body: formDataObj
            });

            const data = await response.json();
              if (!response.ok) {
                // If not successful, parse the error message from the response
                if (data.errors) {
                    // Format validation errors for better user feedback
                    const errorMessages = [];
                    for (const [field, messages] of Object.entries(data.errors)) {
                        errorMessages.push(`${field}: ${messages.join(', ')}`);
                    }
                    
                    throw new Error(`Validation failed: ${errorMessages.join('; ')}`);
                } else {
                    throw new Error(data.message || data.title || "Registration failed");
                }
            }
            
            console.log("Registration successful:", data);
            return { success: true, data };
        } catch(e) {
            console.error("Registration error:", e);
            return { success: false, message: e.message };
        }
    };      const handleSubmit = async (e) => {
        // Clear previous errors
        setFormError(null);
        
        // Set loading state
        setIsSubmitting(true);
        
        try {
            // If we're in OTP verification mode
            if (showOtpForm) {
                if (!formData.otp) {
                    setFormError("Vui lòng nhập mã OTP gửi đến email của bạn.");
                    setIsSubmitting(false);
                    return;
                }
                
                // Complete the registration with OTP
                const result = await completeRegistration();
                
                if (result.success) {
                    // Registration successful - redirect to login page
                    window.location.href = '/signin';
                } else {
                    // Display error message
                    setFormError(result.message || "OTP không hợp lệ. Vui lòng thử lại.");
                }
            } 
            // Initial form submission
            else {
                // Form validation for registration step
                // Check only the fields needed for registration step
                const registrationFields = {
                    surname: formData.surname,
                    givenName: formData.givenName,
                    email: formData.email,
                    password: formData.password,
                    repassword: formData.repassword,
                    birthday: formData.birthday,
                    gender: formData.gender,
                };                console.log("Registration fields to validate:", registrationFields);
                
                // Check each field individually and provide detailed logging
                const emptyFields = Object.entries(registrationFields)
                    .filter(([key, value]) => {
                        const isEmpty = value === null || value === undefined || value === '';
                        console.log(`Field ${key}: '${value}' is ${isEmpty ? 'EMPTY' : 'VALID'}`);
                        return isEmpty;
                    })
                    .map(([key]) => key);
                
                if (emptyFields.length > 0) {
                    console.log("Empty fields detected:", emptyFields);
                    setFormError(errorEmptyInput);
                    setIsSubmitting(false);
                    return;
                }
                
                if (!isCorrectEmail(formData.email)) {
                    setFormError(errorEmailStructure);
                    setIsSubmitting(false);
                    return;
                }
                
                if (!isPasswordMatchRepassword(formData.password, formData.repassword)) {
                    setFormError(errorPasswordMismatch);
                    setIsSubmitting(false);
                    return;
                }
                
                // Request OTP to be sent to email
                const result = await requestOtp();
                
                if (result.success) {
                    // OTP sent, now waiting for user to enter it
                    setFormError(null);
                } else {
                    // Display error message
                    setFormError(result.message);
                }
            }
        } catch (error) {
            // Handle any unexpected errors
            setFormError("An unexpected error occurred. Please try again.");
            console.error("Sign up error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };    // Function to go back to the registration form if needed
    const resetOtpForm = () => {
        setShowOtpForm(false);
        setFormData((prevData) => ({
            ...prevData,
            otp: '', // Use empty string instead of null
        }));
        setFormValidation((prevData) => ({
            ...prevData,
            otp: false,
        }));
        setFormError(null);
        setFormSuccess(null);
    };        // Function to handle OTP completion
    const handleOtpComplete = async (otpValue) => {
        if (!isSubmitting && otpValue?.length === 6) {
            console.log("OTP auto-submission triggered with:", otpValue);
            console.log("Registration data:", registrationData);
            
            // Validate registration data before proceeding
            if (!registrationData || !registrationData.username || !registrationData.password) {
                setFormError("Registration data is incomplete. Please try again.");
                return;
            }
            
            // Test the payload with our diagnostic endpoint
            try {
                // Create a FormData object for testing
                const testFormData = new FormData();
                
                // Add registration data fields
                Object.entries(registrationData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        testFormData.append(key, value);
                    }
                });
                
                // Add OTP to test FormData
                testFormData.append('otp', otpValue);
                
                // Test with regular JSON first to see the output
                const testResponse = await fetch('/api/proxy/test-registration-payload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...registrationData,
                        otp: otpValue
                    })
                });
                  const testResult = await testResponse.json();
                console.log("Registration payload test:", testResult);
            } catch (e) {
                console.warn("Failed to test registration payload:", e);
            }
            
            // Update the OTP in form data
            setFormData(prevData => ({
                ...prevData,
                otp: otpValue
            }));
            
            // Set validation for OTP
            setFormValidation(prevData => ({
                ...prevData,
                otp: true
            }));
            
            // Clear previous errors and success messages
            setFormError(null);
            setFormSuccess(null);
            
            // Set loading state
            setIsSubmitting(true);
            setAutoSubmitting(true);
              try {                // Create a direct registration payload with the necessary fields
                // Ensure all required fields are present and in the exact format expected by the backend
                const registrationPayload = {
                    username: registrationData.username,
                    email: registrationData.email,
                    password: registrationData.password,
                    otp: otpValue,
                    // Use available data or fallback to computed values for optional fields
                    full_name: registrationData.full_name || `${formData.surname} ${formData.givenName}`,
                    birthday: registrationData.birthday || formData.birthday,
                    gender: registrationData.gender || formData.gender
                };                console.log("Submitting registration with direct payload:", registrationPayload);
                
                // Create a FormData object for multipart/form-data request
                const formDataObj = new FormData();
                
                // Add each field to the FormData object
                Object.entries(registrationPayload).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        formDataObj.append(key, value);
                    }
                });
                
                console.log("Sending as multipart/form-data with fields:", Object.keys(registrationPayload));
                  // Make the request directly
                const response = await fetch('/api/proxy/register', {
                    method: 'POST',
                    // Don't set Content-Type header, browser will set it automatically with boundary
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formDataObj
                });
                
                let data;
                try {
                    data = await response.json();
                } catch (jsonError) {
                    console.error("Error parsing response JSON:", jsonError);
                    throw new Error(`Server returned invalid JSON response: ${jsonError.message}`);
                }
                console.log("Registration response:", data);
                
                if (response.ok) {
                    // Show success message
                    setFormSuccess("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
                    
                    // Registration successful - redirect to login page after a short delay
                    setTimeout(() => {
                        window.location.href = '/signin';
                    }, 2000);
                } else {
                    // Display error message
                    if (data.errors) {
                        const errorMessages = [];
                        for (const [field, messages] of Object.entries(data.errors)) {
                            errorMessages.push(`${field}: ${messages.join(', ')}`);
                        }
                        setFormError(`Validation failed: ${errorMessages.join('; ')}`);
                    } else {
                        setFormError(data.message || data.title || "OTP không hợp lệ. Vui lòng thử lại.");
                    }
                }
            } catch (error) {
                console.error("Error during OTP auto-submission:", error);
                setFormError(error.message || "Có lỗi xảy ra khi xác thực OTP. Vui lòng thử lại.");
            } finally {
                setIsSubmitting(false);
                setAutoSubmitting(false);
            }
        }
    };    return {
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
        handleOtpComplete,
    };
}
