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
 * Route handler for retrieving users that the specified user is following
 * GET /api/follow/following/{userId} - Get users following
 */
export async function GET(request, { params }) {
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
        const userId = params.userId;
        const skip = searchParams.get('skip') || 0;
        const take = searchParams.get('take') || 10;
        
        // Validate userId
        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        // Fetch users following
        const apiUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/Follows/following/${userId}`;
        
        const response = await axios.get(
            apiUrl,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: {
                    skip,
                    take
                },
                httpsAgent, // Use the agent that ignores certificate validation
            }
        );

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error("Error in get following users route:", error);
        
        if (error.response) {
            return NextResponse.json(
                { error: error.response.data.error || "Error retrieving following users" },
                { status: error.response.status }
            );
        }
        
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
