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
 * Route handler for following a user
 * POST /api/follow - Follow a user
 */
export async function POST(request) {
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
        if (!requestBody.followerId || !requestBody.followedId) {
            return NextResponse.json(
                { error: "followerId and followedId are required" },
                { status: 400 }
            );
        }

        // Follow a user
        const apiUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/Follows`;
        
        const response = await axios.post(
            apiUrl,
            null, // No request body, using query parameters instead
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: {
                    followerId: requestBody.followerId,
                    followedId: requestBody.followedId
                },
                httpsAgent, // Use the agent that ignores certificate validation
            }
        );

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error("Error in follow route:", error);
        
        if (error.response) {
            return NextResponse.json(
                { error: error.response.data.error || "Error following user" },
                { status: error.response.status }
            );
        }
        
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred" },
            { status: 500 }
        );
    }
}

/**
 * Route handler for unfollowing a user
 * DELETE /api/follow - Unfollow a user
 */
export async function DELETE(request) {
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

        // Unfollow a user
        const apiUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/Follows`;
        
        const response = await axios.delete(
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

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error("Error in unfollow route:", error);
        
        if (error.response) {
            return NextResponse.json(
                { error: error.response.data.error || "Error unfollowing user" },
                { status: error.response.status }
            );
        }
        
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
