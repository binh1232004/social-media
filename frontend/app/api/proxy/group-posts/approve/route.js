import { cookies } from "next/headers";
import https from "https";
import { NextResponse } from 'next/server';
import axios from "axios";

const TOKEN_NAME = "authToken";

// Helper function to get token from cookies in server components
function getTokenFromServerCookies() {
    const cookieStore = cookies();
    return cookieStore.get(TOKEN_NAME)?.value || null;
}

// Create HTTPS agent to ignore SSL certificate validation
const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // Ignore SSL certificate validation
});

export async function POST(request) {
    const token = getTokenFromServerCookies();

    if (!token) {
        return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { groupId, postId, approve } = body;

        if (!groupId || !postId) {
            return NextResponse.json(
                { error: "Missing required parameters: groupId and/or postId" },
                { status: 400 }
            );
        }

        const backendUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/group-posts/${groupId}/approve`;
        
        const response = await axios.post(
            backendUrl,
            { postId, approve }, // Request body
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                httpsAgent: httpsAgent,
            }
        );

        // Return the response from the backend
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error('Error approving/rejecting post:', error);
        
        // Return more detailed error information
        if (error.response) {
            // The request was made and the server responded with a status code outside of 2xx range
            return NextResponse.json(
                error.response.data || { error: 'Failed to approve/reject post' },
                { status: error.response.status }
            );
        } else {
            // Something happened in setting up the request that triggered an Error
            return NextResponse.json(
                { error: 'An error occurred while processing the post approval' },
                { status: 500 }
            );
        }
    }
}
