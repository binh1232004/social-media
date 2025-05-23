import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import https from "https";

const TOKEN_NAME = "authToken";

function getTokenFromServerCookies() {
    const cookieStore = cookies();
    return cookieStore.get(TOKEN_NAME)?.value || null;
}

const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // Ignore SSL certificate validation
});
export async function GET(request) {
    try {
        const authToken = getTokenFromServerCookies();

        if (!authToken) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }
        // Extract query parameters
        const { searchParams } = new URL(request.url);
        const searchTerm = searchParams.get("searchTerm");
        const page = searchParams.get("page") || 1;
        const pageSize = searchParams.get("pageSize") || 10;

        // Validate searchTerm
        if (!searchTerm) {
            return NextResponse.json(
                { error: "Search term cannot be empty." },
                { status: 400 }
            );
        }

        // Call the backend API
        const apiBaseUrl = process.env.NEXT_PUBLIC_FQDN_BACKEND;
        const response = await axios.get(`${apiBaseUrl}/api/groups/search`, {
            params: {
                searchTerm,
                page,
                pageSize,
            },
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            httpsAgent,
        });

        // Return the response data
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error searching groups:", error);

        // Handle specific error statuses
        if (error.response) {
            return NextResponse.json(
                {
                    error:
                        error.response.data.error ||
                        "Error searching for groups",
                },
                { status: error.response.status }
            );
        }

        // Default error
        return NextResponse.json(
            { error: "An error occurred while searching for groups." },
            { status: 500 }
        );
    }
}
