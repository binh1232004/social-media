import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import https from "https";
import { group } from "console";

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
        // Get post ID from route params
        console.log("Request body:", requestBody);
        if(!requestBody.userId && !requestBody.approve && !requestBody.groupId) {
            return NextResponse.json(
                { error: "userId and approve are required" },
                { status: 400 }
            );
        }
        // Make the request to the backend API
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
        const apiUrlApprove = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/group-members/${requestBody.groupId}/approve`;
        delete requestBody.groupId;
        const responseApprove = await axios.post(
            apiUrlAccept,
            requestBody, 
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

        if (error.response) {
            console.error("Error response from backend:", error.response.data);
            return NextResponse.json(
                { error: error.response.data.message || "An error occurred" },
                { status: error.response.status }
            );
        }
    }
}
