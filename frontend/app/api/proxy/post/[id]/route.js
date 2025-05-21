import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import https from 'https';

const TOKEN_NAME = 'authToken';

// Helper function to get token from cookies in server components
function getTokenFromServerCookies() {
  const cookieStore = cookies();
  return cookieStore.get(TOKEN_NAME)?.value || null;
}

// Create HTTPS agent to ignore SSL certificate validation
const httpsAgent = new https.Agent({
  rejectUnauthorized: false // Ignore SSL certificate validation
});

// GET handler to fetch a single post by its ID
export async function GET(request, { params }) {
  try {
    // Get authentication token
    const token = getTokenFromServerCookies();
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the post ID from route params
    const postId = params.id;
    
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    
    // Construct the API URL for the specific post
    const apiUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/posts/${postId}`;
    
    // Make the request to the backend API
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      httpsAgent // Use the agent that ignores certificate validation
    });
    
    // Return the response data
    return NextResponse.json(response.data, { status: 200 });
      } catch (error) {
    console.error("Error fetching post:", error);
    
    // Format error response with more detailed information
    const status = error.response?.status || 500;
    let message = "An error occurred while fetching the post";
    
    if (error.response?.data) {
      console.log("API error response:", JSON.stringify(error.response.data));
      message = error.response.data.message || 
                error.response.data.title || 
                error.response.data.error || 
                message;
      
      // Include validation errors if available
      if (error.response.data.errors) {
        message += ": " + Object.entries(error.response.data.errors)
          .map(([key, val]) => `${key}: ${val.join(', ')}`)
          .join('; ');
      }
    }
    
    return NextResponse.json({ error: message }, { status });
  }
}
