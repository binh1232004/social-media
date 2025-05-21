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

// GET handler to fetch posts
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
        // Parse URL and get params
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const page = searchParams.get("page") || 1;
        const pageSize = searchParams.get("pageSize") || 10;

        // Construct the API URL based on whether we're fetching for specific user or current user
        const apiUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/user-posts/${userId}`;

        // Make the request to the backend API
        const response = await axios.get(apiUrl, {
            params: {
                page,
                pageSize,
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            httpsAgent, // Use the agent that ignores certificate validation
        });

        // Return the response data
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error("Error fetching posts:", error);

        // Format error response
        const status = error.response?.status || 500;
        const message =
            error.response?.data?.message ||
            "An error occurred while fetching posts";

        return NextResponse.json({ error: message }, { status });
    }
}

export async function POST(request) {
    try {
        // Get the authentication token
        const token = getTokenFromServerCookies();        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Extract data from the request body as JSON
        const requestData = await request.json();
        const { content, media } = requestData;

        // Add more detailed logging for debugging
        console.log("====== SERVER SIDE LOGGING ======");
        console.log("Content received:", content);
        console.log("Content type:", typeof content);
        console.log("Content length:", content ? content.length : 0);
        console.log("Media received:", media);
        console.log("================================");

        if (!content || content.trim() === "") {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }
          // Prepare request body for the backend API
        // Media files are now handled by the separate upload-media API route
        const requestBody = {
            content,
            media: media || []
        };
        // Send post creation request to backend API
        const httpsAgent = new (require("https").Agent)({
            rejectUnauthorized: false, // Ignore SSL certificate validation
        });

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/user-posts`,
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                httpsAgent, // Use the agent that ignores certificate validation
            }
        );

        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);

        // Format error response with more detailed information
        const status = error.response?.status || 500;
        let message = "An error occurred while creating the post";

        if (error.response?.data) {
            console.log(
                "API error response:",
                JSON.stringify(error.response.data)
            );
            message =
                error.response.data.message ||
                error.response.data.title ||
                error.response.data.error ||
                message;

            // Include validation errors if available
            if (error.response.data.errors) {
                message +=
                    ": " +
                    Object.entries(error.response.data.errors)
                        .map(([key, val]) => `${key}: ${val.join(", ")}`)
                        .join("; ");
            }
        }

        return NextResponse.json({ error: message }, { status });
    }
}
