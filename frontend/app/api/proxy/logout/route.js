import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create a response that will clear the auth cookies
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });
    
    // Clear both cookies
    response.cookies.delete('authToken');
    response.cookies.delete('authToken_exists');
    
    return response;
  } catch (error) {
    console.error("Error in logout endpoint:", error);
    return NextResponse.json({ 
      success: false,
      message: error.message || "Error during logout"
    }, { status: 500 });
  }
}

export async function GET() {
  // For testing the endpoint
  return NextResponse.json({ message: "Logout endpoint is working. Use POST to log out." });
}
