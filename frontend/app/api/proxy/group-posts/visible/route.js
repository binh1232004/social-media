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
 * Route handler for updating post visibility
 * PUT /api/group-posts/visible - Toggle post visibility
 */
export async function PUT(request) {
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
        if (requestBody.postId === undefined || requestBody.isVisible === undefined) {
            return NextResponse.json(
                { error: "postId and isVisible are required" },
                { status: 400 }
            );
        }

        // Update post visibility
        const apiUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/group-posts/visible`;
        
        const response = await axios.put(
            apiUrl,
            {
                postId: requestBody.postId,
                isVisible: requestBody.isVisible
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                httpsAgent, // Use the agent that ignores certificate validation
            }
        );

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error("Error in update post visibility route:", error);
        
        if (error.response) {
            return NextResponse.json(
                { error: error.response.data.error || "Error updating post visibility" },
                { status: error.response.status }
            );
        }
        
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
