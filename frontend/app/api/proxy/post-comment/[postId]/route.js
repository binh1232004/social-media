import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import https from "https";
import axios from "axios";

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
 * API proxy for adding comments to posts
 *
 * This endpoint proxies requests to the backend API for posting comments
 * on specific posts. It handles authentication and error responses.
 */
export async function POST(request, { params }) {
    const { postId } = params;
    const authToken = getTokenFromServerCookies();

    if (!authToken) {
        return NextResponse.json(
            { error: "You must be logged in to comment on posts" },
            { status: 401 }
        );
    }
    try {
        let commentData;
        try {
            commentData = await request.json();
        } catch (parseError) {
            console.error("Error parsing request JSON:", parseError);
            return NextResponse.json(
                { error: "Invalid request format" },
                { status: 400 }
            );
        }

        const content = commentData?.content;
        const parentCommentId = commentData?.parentCommentId;

        if (!content) {
            return NextResponse.json(
                { error: "Comment content is required" },
                { status: 400 }
            );
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/posts/${postId}/comments`;

        const requestBody = {
            content: content,
            parentCommentId: parentCommentId || null,
        };
        try {
            const response = await axios.post(apiUrl, requestBody, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                httpsAgent, // Use the agent that ignores certificate validation
            });

            // Ensure we have valid data before sending response
            if (!response.data) {
                return NextResponse.json(
                    { error: "No data returned from API" },
                    { status: 500 }
                );
            }

            // Return successful response with comment data
            return NextResponse.json(response.data, { status: 201 });
        } catch (axiosError) {
            // Handle axios-specific errors
            console.error("Axios error:", axiosError);

            if (axiosError.response) {
                // The server responded with a status code outside of 2xx range
                const status = axiosError.response.status;
                const errorMessage =
                    axiosError.response.data?.message ||
                    "Error from backend service";
                return NextResponse.json({ error: errorMessage }, { status });
            }

            // Network error or request cancelled
            return NextResponse.json(
                { error: "Failed to connect to backend service" },
                { status: 502 }
            );
        }
    } catch (error) {
        console.error("Error posting comment:", error);

        // Generic catch-all error handler
        return NextResponse.json(
            {
                error: "An unexpected error occurred while processing your comment",
            },
            { status: 500 }
        );
    }
}
