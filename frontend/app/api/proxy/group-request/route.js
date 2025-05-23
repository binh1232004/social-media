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

// Create HTTPS agent to ignore SSL certificate validation
const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // Ignore SSL certificate validation
});

/**
 * Route handler for post voting (like/unlike)
 * Using documentation from:
 * POST /api/posts/{postId}/vote
 * Toggles a vote on a specific post
 */
export async function POST(request, { params }) {
    try {
        // Get authentication token
        const token = getTokenFromServerCookies();

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        
        const requestBody = await request.json();
        
        // Validate request body
        if(!requestBody.groupId) {
            return NextResponse.json(
                { error: "groupId is required" },
                { status: 400 }
            );
        }

        const apiUrlRequest = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/group-members/request`;
        
        const responseRequest = await axios.post(
            apiUrlRequest,
            {groupId: requestBody.groupId}, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                httpsAgent, // Use the agent that ignores certificate validation
            }
        );
        
        
            
            // Return success with both responses
            return NextResponse.json({ 
                success: true,
                // request: responseRequest.data,
                // approve: responseApprove.data
            }, { status: 200 });
        
        // If first call didn't return 200/201, return that response
        
    } catch (error) {
        console.error("Error in group-members route:", error);
        
        if (error.response) {
            return NextResponse.json(
                { error: error.response.data.message || "An error occurred" },
                { status: error.response.status }
            );
        }
        
        // Always return a response for unexpected errors
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
