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
 * Route handler for checking if a user is following another user
 * GET /api/follow/check - Check follow status
 */
export async function GET(request) {
    try {
        // Get authentication token
        const token = getTokenFromServerCookies();

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const followerId = searchParams.get('followerId');
        const followedId = searchParams.get('followedId');
        
        // Validate request parameters
        if (!followerId || !followedId) {
            return NextResponse.json(
                { error: "followerId and followedId are required" },
                { status: 400 }
            );
        }

        // Check follow status
        const apiUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/Follows/is-following`;
        
        const response = await axios.get(
            apiUrl,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: {
                    followerId,
                    followedId
                },
                httpsAgent, // Use the agent that ignores certificate validation
            }
        );

        return NextResponse.json({ isFollowing: response.data }, { status: response.status });
    } catch (error) {
        console.error("Error in check follow status route:", error);
        
        // If the API doesn't have this endpoint, assume not following
        if (error.response && error.response.status === 404) {
            return NextResponse.json({ isFollowing: false }, { status: 200 });
        }
        
        if (error.response) {
            return NextResponse.json(
                { error: error.response.data.error || "Error checking follow status" },
                { status: error.response.status }
            );
        }
        
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
