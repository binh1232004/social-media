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

// POST handler to create a post in a group
export async function POST(request) {
    try {
        // Get authentication token
        const token = getTokenFromServerCookies();

        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Get request body
        const requestBody = await request.json();

        // Get the backend URL from environment variables
        const backendUrl = process.env.NEXT_PUBLIC_FQDN_BACKEND;
        
        if (!backendUrl) {
            return NextResponse.json(
                { error: 'Backend URL not configured' }, 
                { status: 500 }
            );
        }
        
        // Make request to the backend API
        const response = await axios.post(
            `${backendUrl}/api/group-posts`,
            requestBody,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                httpsAgent
            }
        );

        // Return the data from the API response
        return NextResponse.json(response.data, { status: 201 });
        
    } catch (error) {
        console.error("Error creating group post:", error.response?.data || error.message);
        
        // Return appropriate error response
        return NextResponse.json(
            { 
                error: error.response?.data?.error || "An error occurred while creating the group post" 
            },
            { 
                status: error.response?.status || 500 
            }
        );
    }
}
