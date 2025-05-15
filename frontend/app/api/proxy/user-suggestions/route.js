import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

const TOKEN_NAME = 'authToken';

/**
 * Fetches user suggestions from the backend API
 * @param {Request} request - The incoming request
 * @returns {Promise<NextResponse>} The response with suggested users
 */
export async function GET(request) {
  try {
    // Get the count parameter from the URL query string
    const { searchParams } = new URL(request.url);
    const count = searchParams.get('count') || '10';
    
    // Get auth token from the request cookies
    const token = request.cookies.get(TOKEN_NAME)?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    // Create HTTPS agent that ignores SSL certificate errors
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });

    // Get the backend URL from environment variables
    const backendUrl =  process.env.NEXT_PUBLIC_FQDN_BACKEND;
    

    
    // Make request to the backend API with SSL verification disabled
    const response = await axios.get(
      `${backendUrl}/api/User/suggestions?count=${count}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        httpsAgent: httpsAgent
      }
    );

    // Return the data from the backend
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching user suggestions:', error);
    
    // Handle different types of errors
    if (error.response) {
      // The backend returned an error response
      return NextResponse.json(
        { error: error.response.data?.message || 'Failed to fetch user suggestions' }, 
        { status: error.response.status }
      );
    } else if (error.code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
      // Handle self-signed certificate error
      return NextResponse.json(
        { error: 'SSL certificate error. Please check server configuration.' }, 
        { status: 500 }
      );
    } else if (error.code === 'ERR_INVALID_URL') {
      // Handle invalid URL error
      return NextResponse.json(
        { error: 'Invalid backend URL configuration' }, 
        { status: 500 }
      );
    }
    
    // Network error or other issues
    return NextResponse.json(
      { error: 'Failed to connect to the suggestion service' }, 
      { status: 500 }
    );
  }
}