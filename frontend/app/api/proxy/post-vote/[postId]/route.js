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

        // Get post ID from route params
        const postId = params.postId;
        
        if (!postId) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 }
            );
        }

        // Make the request to the backend API
        const apiUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/posts/${postId}/vote`;

        const response = await axios.post(
            apiUrl,
            {}, // Empty body as per API docs
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                httpsAgent, // Use the agent that ignores certificate validation
            }
        );

        // Return success response
        return NextResponse.json({ success: true }, { status: 200 });    } catch (error) {
        console.error("Error voting on post:", error);        // Format error response with more detailed information
        const status = error.response?.status || 500;
        let message = "An error occurred while voting on the post";

        if (error.response?.data) {
            message = error.response.data.message || error.response.data.error || message;
        }
        
        // Handle specific error codes
        if (status === 401) {
            message = "You need to be logged in to vote";
        } else if (status === 403) {
            message = "You don't have permission to vote on this post";
        } else if (status === 404) {
            message = "This post no longer exists";
        } else if (status === 429) {
            message = "Too many requests, please try again later";
        }

        return NextResponse.json({ error: message }, { status });
    }
}
