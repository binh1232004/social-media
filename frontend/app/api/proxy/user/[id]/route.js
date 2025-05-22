import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

const TOKEN_NAME = 'authToken';

/**
 * Proxy for fetching user profile data from backend
 * @param {Request} request - The incoming request
 * @param {Object} params - URL parameters
 * @param {string} params.id - The user ID or 'me' for current user
 * @returns {Promise<NextResponse>} The API response
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
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
    // Handle 'me' endpoint separately
    const endpoint =  `${backendUrl}/api/Users/${id}`;
      
    const response = await axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      httpsAgent
    });

    // Return the data from the backend
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    
    // Handle different types of errors
    if (error.response) {
      // The backend returned an error response
      return NextResponse.json(
        { error: error.response.data?.message || 'Failed to fetch user profile' }, 
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
      { error: 'Failed to connect to the user service' }, 
      { status: 500 }
    );
  }
}

/**
 * Proxy for updating user profile data
 * @param {Request} request - The incoming request
 * @param {Object} params - URL parameters
 * @param {string} params.id - The user ID
 * @returns {Promise<NextResponse>} The API response
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
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
    }    // Handle form data from the request
    const formData = await request.formData();
    
    // Create a JSON object that matches the expected API format
    const updateData = {};
    
    // Extract and map fields according to API documentation
    if (formData.get('fullName')) updateData.fullName = formData.get('fullName');
    if (formData.get('intro')) updateData.intro = formData.get('intro');
    if (formData.get('gender')) updateData.gender = formData.get('gender');
    if (formData.get('birthday')) updateData.birthday = formData.get('birthday');
    if (formData.get('image')) updateData.image = formData.get('image');
    
    // Make request to the backend API
    const endpoint = `${backendUrl}/api/Users/${id}`;
    
    console.log('Updating user profile with data:', updateData);
    
    const response = await axios.put(
      endpoint, 
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        httpsAgent
      }
    );
    
    // Forward the response
    return NextResponse.json(response.data, { status: response.status });

  } catch (error) {
    console.error('Error updating user profile:', error);
    
    // Return appropriate error response
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      return NextResponse.json(
        { error: error.response.data?.message || 'Server error' }, 
        { status: error.response.status || 500 }
      );
    } else if (error.request) {
      // The request was made but no response was received
      return NextResponse.json(
        { error: 'No response from server. Please try again later.' }, 
        { status: 503 }
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      return NextResponse.json(
        { error: error.message || 'An unexpected error occurred' }, 
        { status: 500 }
      );
    }
  }
}
