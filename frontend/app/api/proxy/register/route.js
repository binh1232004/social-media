import { NextResponse } from "next/server";
import axios from 'axios';
import FormData from 'form-data';

// Support both GET and POST for debugging
export async function GET() {
  return NextResponse.json({ message: "Registration endpoint is working. Use POST to register." });
}

export async function POST(request) {
  try {
    // Get the request body
    let body = {};
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      // Handle FormData submission
      const formData = await request.formData();
      // Convert FormData to object
      formData.forEach((value, key) => {
        body[key] = value;
      });
    } else {
      // Handle JSON submission
      try {
        body = await request.json();
      } catch (jsonError) {
        console.error("Error parsing request JSON:", jsonError);
        return NextResponse.json({
          success: false,
          message: `Invalid JSON in request body: ${jsonError.message}`
        }, { status: 400 });
      }
    }
    console.log("Proxy received registration request:", body);
    
    // Validate required fields
    const requiredFields = ['username', 'password', 'otp'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.error(`Registration request missing required fields: ${missingFields.join(', ')}`);
      return NextResponse.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }
    
    // Ensure the body has the correct structure expected by the backend
    const sanitizedBody = {
      // Explicitly convert to string and trim to ensure proper format
      username: String(body.username).trim(),
      password: String(body.password).trim(),
      otp: String(body.otp).trim(),
      email: body.email ? String(body.email).trim() : "",
      full_name: body.full_name ? String(body.full_name).trim() : "",
      birthday: body.birthday ? String(body.birthday).trim() : "",
      gender: body.gender ? String(body.gender).trim() : ""
    };
    
    console.log("Sanitized request body:", sanitizedBody);
    
    try {
      // Extract OTP for URL parameter
      const otpValue = sanitizedBody.otp;
      
      // Remove OTP from body since it will be a URL parameter
      const { otp, ...bodyWithoutOtp } = sanitizedBody;
        // Construct full URL with OTP parameter (properly encoded)
      const fullUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/Authentication/register?otp=${encodeURIComponent(otpValue)}`;
        console.log("Making request to:", fullUrl);
        // Create FormData object for multipart/form-data request
      const formData = new FormData();
      
      // Add each field to the FormData object
      Object.entries(bodyWithoutOtp).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      });
      
      console.log("Sending as multipart/form-data with fields:", Object.keys(bodyWithoutOtp));
        // Using axios to make the HTTP request with OTP in the URL
      const response = await axios.post(
        fullUrl,
        formData,
        {
          headers: {
            // Safely get form headers if available or set content type manually
            ...(typeof formData.getHeaders === 'function' ? formData.getHeaders() : { 'Content-Type': 'multipart/form-data' }),
            'Accept': 'application/json',
            // Adding extra headers to help with debugging
            'X-Client': 'Frontend-Proxy',
            'X-Request-ID': Date.now().toString()
          },
          // Ignore SSL certificate errors for local development
          httpsAgent: new (require('https').Agent)({ 
            rejectUnauthorized: false 
          })
        }
      );
      
      // Successful response
      console.log("Backend response status:", response.status);
      console.log("Backend response data:", response.data);
      
      return NextResponse.json(response.data, { status: response.status });
      
    } catch (error) {
      // Handle errors
      console.error("Backend request error:", error.message);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Backend error status:", error.response.status);
        console.log("Backend error data:", error.response.data);
        
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
        return NextResponse.json({ 
          success: false, 
          message: "No response received from server" 
        }, { status: 503 });
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
    console.error('Registration proxy error:', error);
    return NextResponse.json(
      { message: error.message || 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
