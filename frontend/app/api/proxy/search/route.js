import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

const TOKEN_NAME = 'authToken';

/**
 * Proxies search requests to the backend API
 * @param {Request} request - The incoming request
 * @returns {Promise<NextResponse>} - The search results
 */
export async function GET(request) {
  try {
    // Get search parameters from the URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '10';
    
    // Get auth token from the request cookies
    const token = request.cookies.get(TOKEN_NAME)?.value;
    
    if (!token) {
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
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_FQDN_BACKEND;
    
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend URL not configured' }, 
        { status: 500 }
      );
    }

    // Make request to the backend API
    const response = await axios.get(
      `${backendUrl}/api/Search/users`,
      {
        params: {
          query,
          page,
          pageSize
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        httpsAgent
      }
    );

    // Return the data from the backend
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error searching users:', error);
    
    // Handle different types of errors
    if (error.response) {
      // The backend returned an error response
      return NextResponse.json(
        { error: error.response.data?.message || 'Failed to search users' }, 
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
      { error: 'Failed to connect to the search service' }, 
      { status: 500 }
    );
  }
}
