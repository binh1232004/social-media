
import { cookies } from "next/headers";
import https from "https";
import { NextResponse } from 'next/server';
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

export async function GET(request, { params }) {
    const token = getTokenFromServerCookies();

        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }
  const { groupId } = params;
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('pageSize') || '10';


  const backendUrl = `${process.env.NEXT_PUBLIC_FQDN_BACKEND}/api/group-posts/pending/${groupId}?page=${page}&pageSize=${pageSize}`;

  try {
    const response = await axios.get(backendUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      httpsAgent: httpsAgent, // Use the HTTPS agent to ignore SSL certificate validation
    });

    // With axios, response.data is already parsed
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('Error fetching pending group posts:', error);
    return NextResponse.json({ error: 'An error occurred while fetching pending group posts.' }, { status: 500 });
  }
}
