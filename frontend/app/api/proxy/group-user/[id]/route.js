import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import https from "https";

const TOKEN_NAME = "authToken";

// Helper function to get token from cookies in server components
function getTokenFromServerCookies() {
    const cookieStore = cookies();
    return cookieStore.get(TOKEN_NAME)?.value || null;
}


export async function GET(request, { params }) {
  try {
    const groupId = params.id;
    
    const authToken = getTokenFromServerCookies();
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    // Create HTTPS agent that ignores SSL certificate errors (for development)
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });

    // Get the backend URL from environment variables
    const backendUrl =  process.env.NEXT_PUBLIC_FQDN_BACKEND;
    
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend URL not configured' }, 
        { status: 500 }
      );
    }

    // Make request to the backend API
    // Handle 'me' endpoint separately
    const endpoint =  `${backendUrl}/api/group-members/${groupId}/is-member-group`;
      
    const response = await axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      httpsAgent
    });

    // Return the data from the backend
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching is member:', error);
  }
}