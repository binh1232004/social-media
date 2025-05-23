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

export async function GET(request, { params }) {
    try {
        const groupId = params.groupId;
        
        // Get authentication token
        const token = getTokenFromServerCookies();

        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Get query parameters
        const url = new URL(request.url);
        const page = url.searchParams.get("page") || 1;
        const pageSize = url.searchParams.get("pageSize") || 10;
        
        // Log requests for debugging
        console.log(`Fetching group posts for group ${groupId}, page ${page}, pageSize ${pageSize}`);        // Get the backend URL from environment variables
        const backendUrl = process.env.NEXT_PUBLIC_FQDN_BACKEND;
        
        if (!backendUrl) {
          return NextResponse.json(
            { error: 'Backend URL not configured' }, 
            { status: 500 }
          );
        }
        
        // Make request to backend API
        const response = await axios.get(
            `${backendUrl}/api/group-posts/${groupId}`, 
            {
                params: {
                    page,
                    pageSize
                },
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                httpsAgent
            }
        );

        // Return the data from the API response
        return NextResponse.json(response.data);
        
    } catch (error) {
        console.error("Error fetching group posts:", error.response?.data || error.message);
        
        // Return appropriate error response
        return NextResponse.json(
            { 
                error: error.response?.data?.error || "An error occurred while fetching group posts" 
            },
            { 
                status: error.response?.status || 500 
            }
        );
    }
}
