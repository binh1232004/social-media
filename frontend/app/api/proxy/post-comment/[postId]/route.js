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

/**
 * API proxy for retrieving comments for a post
 *
 * This endpoint proxies requests to the backend API for retrieving comments
 * for a specific post. It handles authentication, pagination, and nested structure.
 */
export async function GET(request, { params }) {
    const { postId } = params;
    const authToken = getTokenFromServerCookies();

    if (!authToken) {
        return NextResponse.json(
            { error: "You must be logged in to view comments" },
            { status: 401 }
        );
    }

    try {
        // Get query parameters
        const url = new URL(request.url);
        const skip = url.searchParams.get("skip") || 0;
        const take = url.searchParams.get("take") || 10;
        const nested = url.searchParams.get("nested") === "true";

        // Build API URL with query parameters
        const apiUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/Comments/post/${postId}`;
        const queryParams = new URLSearchParams({
            skip,
            take,
            nested,
        }).toString();

        const fullUrl = `${apiUrl}?${queryParams}`;
        
        console.log('Fetching comments from backend:', fullUrl);

        try {
            const response = await axios.get(fullUrl, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                httpsAgent, // Use the agent that ignores certificate validation
            });

            console.log('Comment API response status:', response.status);
            
            // Log the structure of the response
            if (response.data) {
                const isArray = Array.isArray(response.data);
                const itemCount = isArray ? response.data.length : 'N/A';
                console.log('Comment response structure:', {
                    isArray,
                    itemCount,
                    firstItemSample: isArray && response.data.length > 0 ? 
                        JSON.stringify(response.data[0]).substring(0, 100) + '...' : 'N/A'
                });
            }

            // Return successful response with comments data
            return NextResponse.json(response.data, { status: 200 });
        } catch (axiosError) {
            console.error("Axios error fetching comments:", axiosError);

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
        console.error("Error fetching comments:", error);

        // Generic catch-all error handler
        return NextResponse.json(
            {
                error: "An unexpected error occurred while retrieving comments",
            },
            { status: 500 }
        );
    }
}
