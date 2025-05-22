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
 * Route handlers for group-related actions
 * - POST: Create a new group with the current user as admin
 * - GET: Retrieve a list of groups accessible to the current user
 */
export async function POST(request) {
    try {
        const requestBody = await request.json();
        console.log("======== PROXY GROUP CREATE REQUEST =======");
        console.log("Request Body:", requestBody);
        console.log("===========================================");
        // Get authentication token
        const token = getTokenFromServerCookies();

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Validate required fields
        if (!requestBody.groupName) {
            return NextResponse.json(
                { error: "Group name is required" },
                { status: 400 }
            );
        }        // Map the frontend field names to the expected backend field names
        const backendRequestBody = {
            groupName: requestBody.groupName,
            visibility: requestBody.privacy === "public" ? "Public" : "Private", 
            image: requestBody.coverPhoto // Map coverPhoto to image
        };

        // Make the request to the backend API
        const apiUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/groups`;

        const response = await axios.post(
            apiUrl,
            backendRequestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                httpsAgent, // Use the agent that ignores certificate validation
            }
        );

        // Return the created group data
        return NextResponse.json(response.data, { status: 201 });    } catch (error) {
        console.error("Error creating group:", error);        // Format error response with more detailed information
        const status = error.response?.status || 500;
        let message = "An error occurred while creating the group";

        if (error.response?.data) {
            message = error.response.data.message || error.response.data.error || message;
        }
        
        // Handle specific error codes
        if (status === 400) {
            message = error.response?.data?.error || "Invalid group information";
        } else if (status === 401) {
            message = "You need to be logged in to create a group";
        } else if (status === 403) {
            message = "You don't have permission to create a group";
        } else if (status === 429) {
            message = "Too many requests, please try again later";
        }        return NextResponse.json({ error: message }, { status });
    }
}

/**
 * Route handler for retrieving groups
 * Using documentation from:
 * GET /api/groups
 * Retrieves a paginated list of groups accessible to the user
 */
export async function GET(request) {
    try {
        // Get authentication token
        const token = getTokenFromServerCookies();

        if (!token) {
            return NextResponse.json(
                { error: "You must be logged in to view groups" },
                { status: 401 }
            );
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || 1;
        const pageSize = searchParams.get("pageSize") || 10;

        // Build API URL with query parameters
        const apiUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/groups`;
        const queryParams = new URLSearchParams({
            page: page,
            pageSize: pageSize
        }).toString();

        const fullUrl = `${apiUrl}?${queryParams}`;        // Make the request to the backend API
        const response = await axios.get(
            fullUrl,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                httpsAgent, // Use the agent that ignores certificate validation
            }
        );

        console.log("======== PROXY GROUP FETCH RESPONSE =======");
        console.log("Response Data:", response.data);
        console.log("===========================================");

        // Return the groups data - add default empty groups array if missing
        const responseData = response.data;
        if (responseData && !responseData.groups && Array.isArray(responseData)) {
            // If backend returns array directly, format it properly
            return NextResponse.json({
                groups: responseData,
                totalGroups: responseData.length,
                totalPages: Math.ceil(responseData.length / pageSize)
            }, { status: 200 });
        }
        
        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Error retrieving groups:", error);

        // Format error response with more detailed information
        const status = error.response?.status || 500;
        let message = "An error occurred while retrieving groups";

        if (error.response?.data) {
            message = error.response.data.message || error.response.data.error || message;
        }
        
        // Handle specific error codes
        if (status === 401) {
            message = "You need to be logged in to view groups";
        } else if (status === 429) {
            message = "Too many requests, please try again later";
        }

        return NextResponse.json({ error: message }, { status });
    }
}
