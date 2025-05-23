import { NextResponse } from "next/server";
import axios from 'axios';

// Support both GET and POST for debugging
export async function GET() {
  return NextResponse.json({ message: "Login endpoint is working. Use POST to log in." });
}

export async function POST(request) {
  try {
    // Get the request body
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error("Error parsing request JSON:", jsonError);
      return NextResponse.json({
        success: false,
        message: `Invalid JSON in request body: ${jsonError.message}`
      }, { status: 400 });
    }    console.log("Proxy received login request:", body);
    
    // Validate required fields
    const requiredFields = ['email', 'password'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.error(`Login request missing required fields: ${missingFields.join(', ')}`);
      return NextResponse.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }
    
    // Ensure the body has the correct structure expected by the backend
    const sanitizedBody = {
      email: String(body.email).trim(), // Using email as username for the backend
      password: String(body.password).trim()
    };
    
    console.log("Sanitized login body:", sanitizedBody);
    
    try {
      // Construct full URL for the login endpoint
      const fullUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/Authentication/login`;
      
      console.log("Making login request to:", fullUrl);
      
      // Using axios to make the HTTP request
      const response = await axios.post(
        fullUrl,
        sanitizedBody,
        {
          headers: {
            'Content-Type': 'application/json',
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
      console.log("Backend login response status:", response.status);
      console.log("Backend login response data:", response.data);
      // Enhanced logging of the response
      console.log("======== BACKEND RESPONSE ========");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);
      console.log("Headers:", response.headers);
      console.log("Data:", JSON.stringify(response.data, null, 2));
      console.log("=================================");
      
      // Extract token from the response
      const token = response.data.token || 
                   response.data.accessToken || 
                   response.data.access_token || 
                   (response.data.data && (
                     response.data.data.token || 
                     response.data.data.accessToken || 
                     response.data.data.access_token
                   ));
                     if (token) {
        // Extract user information from the token if possible
        let userInfo = null;
        try {
          // JWT tokens have three parts: header.payload.signature
          const parts = token.split('.');
          if (parts.length === 3) {
            // The payload is the second part and is base64 encoded
            const base64Payload = parts[1];
            // Replace URL-safe chars and add padding if needed
            const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
            // Decode and parse as JSON
            const payload = JSON.parse(atob(base64));
            
            // Create user info object
            userInfo = {
              userId: payload.user_id || payload.userId || payload.sub,
              profileImage: payload.image || payload.profileImage || payload.picture,
              name: payload.name || payload.full_name || payload.username,
              email: payload.email,
              exp: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : null,
            };
            
            console.log('Extracted user info from token:', userInfo);
          }
        } catch (e) {
          console.error('Error extracting user info from JWT token:', e);
        }
        
        // Create a new response
        const nextResponse = NextResponse.json({
          ...response.data,
          userInfo // Include parsed user info in the response
        }, { status: response.status });
        
        // Set auth token cookie from the server side (more secure)
        // Try to decode token to get expiration
        let expiryDate;
        try {
          // JWT tokens have three parts: header.payload.signature
          const parts = token.split('.');
          if (parts.length === 3) {
            // The payload is the second part and is base64 encoded
            const base64Payload = parts[1];
            // Replace URL-safe chars and add padding if needed
            const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
            // Decode and parse as JSON
            const payload = JSON.parse(atob(base64));
            
            if (payload.exp) {
              // exp is in seconds since epoch, convert to milliseconds for Date
              expiryDate = new Date(payload.exp * 1000);
              console.log(`Token will expire on: ${expiryDate.toLocaleString()}`);
            }
          }
        } catch (e) {
          console.error('Error decoding JWT token:', e);
        }
        
        // If no expiration found in token, default to 1 day
        if (!expiryDate) {
          expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 1);
          console.log('No expiration found in token, using 1-day default');
        }
        
        // Set secure cookie options
        const cookieOptions = {
          expires: expiryDate,
          path: '/',
          sameSite: 'lax', // Use 'strict' for production
          httpOnly: true, // Makes cookie inaccessible to client-side JavaScript
          secure: process.env.NODE_ENV === 'production' // Only use HTTPS in production
        };
        
        console.log("Setting auth cookie with options:", cookieOptions);
        
        // Set the HTTP-only secure cookie with the token
        nextResponse.cookies.set('authToken', token, cookieOptions);
        
        // Set a non-HttpOnly cookie for client-side auth check
        nextResponse.cookies.set('authToken_exists', 'true', {
          ...cookieOptions,
          httpOnly: false
        });
        
        return nextResponse;
      }
      
      return NextResponse.json(response.data, { status: response.status });
      
    } catch (error) {
      // Handle errors
      console.error("Backend login request error:", error.message);
      
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
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { message: error.message || 'An error occurred during login' },
      { status: 500 }
    );
  }
}
