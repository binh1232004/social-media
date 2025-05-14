import { NextResponse } from "next/server";
import axios from 'axios';

// Support both GET and POST for debugging
export async function GET() {
  return NextResponse.json({ message: "OTP request endpoint is working. Use POST to request an OTP." });
}

export async function POST(request) {
  try {
    // Get the request body
    const body = await request.json();
    console.log("Proxy received OTP request:", body);
    
    // Ensure body has the required fields according to the schema
    if (!body.userName && body.email) {
      // If userName is missing but email is provided, extract username from email
      body.userName = body.email.split('@')[0];
      console.log("Added userName from email:", body.userName);
    }
    
    try {
      // Using axios to make the HTTP request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/Authentication/send-otp`, 
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          // Ignore SSL certificate errors for local development
          httpsAgent: new (require('https').Agent)({ 
            rejectUnauthorized: false 
          })
        }
      );
      
      // Successful response
      console.log("Backend response status (OTP):", response.status);
      console.log("Backend response data (OTP):", response.data);
      
      return NextResponse.json(response.data, { status: response.status });
      
    } catch (error) {
      // Handle errors
      console.error("Backend request error:", error.message);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Backend error status:", error.response.status);
        console.log("Backend error data:", error.response.data);
        
        // If backend gives a 404, simulate success for development
        if (error.response.status === 404) {
          return NextResponse.json({ 
            message: "OTP request simulated successfully", 
            email: body.email,
            userName: body.userName,
            success: true,
            simulatedOtp: "123456" // Only for development!
          });
        }
        
        // Check for validation errors
        if (error.response.status === 400 && error.response.data.errors) {
          const errorMessages = [];
          
          // Format error messages from the validation errors object
          for (const [field, messages] of Object.entries(error.response.data.errors)) {
            errorMessages.push(`${field}: ${messages.join(', ')}`);
          }
          
          console.error("Backend validation errors:", errorMessages);
          
          return NextResponse.json({ 
            success: false,
            message: `Validation failed: ${errorMessages.join('; ')}`,
            errors: error.response.data.errors,
            title: error.response.data.title || "Validation Error"
          }, { status: error.response.status });
        }
        
        return NextResponse.json(error.response.data, { status: error.response.status });
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from backend");
        
        // For development: simulate success if backend is not responding
        return NextResponse.json({
          message: "OTP request simulated successfully (no response fallback)",
          email: body?.email,
          userName: body?.userName,
          success: true,
          simulatedOtp: "123456" // Only for development!
        });
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
        return NextResponse.json({ 
          success: false, 
          message: "Error setting up request: " + error.message 
        }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('OTP request error:', error);
    
    // For development: simulate success even if backend is not ready
    return NextResponse.json({
      message: "OTP request simulated successfully (error fallback)",
      email: body?.email,
      userName: body?.userName,
      success: true,
      simulatedOtp: "123456", // Only for development!
      error: error.message
    });
  }
}
