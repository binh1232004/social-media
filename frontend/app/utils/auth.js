'use client';

const TOKEN_NAME = 'authToken';

/**
 * Decodes a JWT token to get its payload
 * @param {string} token - The JWT token to decode
 * @returns {Object|null} - The decoded token payload or null if invalid
 */
function decodeJwt(token) {
  try {
    // JWT tokens have three parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // The payload is the second part and is base64 encoded
    const base64Payload = parts[1];
    // Replace URL-safe chars and add padding if needed
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    // Decode and parse as JSON
    const payload = JSON.parse(atob(base64));
    return payload;
  } catch (e) {
    console.error('Error decoding JWT token:', e);
    return null;
  }
}

/**
 * Sets the authentication token in localStorage
 * @param {string} token - The authentication token to store
 * @returns {Object} - Information about the token including its expiration
 */
export function setAuthToken(token) {
  // Save to localStorage for client-side access
  localStorage.setItem(TOKEN_NAME, token);
  
  // Try to decode the token to get expiration time
  const decodedToken = decodeJwt(token);
  
  // Get expiration time if available
  let expiryDate;
  
  if (decodedToken?.exp) {
    // exp is in seconds since epoch, convert to milliseconds for Date
    expiryDate = new Date(decodedToken.exp * 1000);
    console.log(`Token will expire on: ${expiryDate.toLocaleString()}`);
  } else {
    // Fallback to 1 day expiration if no exp in token
    expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    console.log('No expiration found in token, using 1-day default');
  }
  
  // Set token in Next.js client-side cookie for middleware access
  document.cookie = `${TOKEN_NAME}=${token}; Path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
  
  // Return token information for additional handling if needed
  return {
    token,
    expiryDate,
    decodedToken
  };
}

/**
 * Gets the authentication token from localStorage
 * @returns {string|null} The authentication token or null if not found
 */
export function getAuthToken() {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_NAME);
}

/**
 * Removes the authentication token from localStorage and cookie
 */
export function removeAuthToken() {
  // Remove from localStorage
  localStorage.removeItem(TOKEN_NAME);
  
  // Remove cookie by setting it to expire in the past
  document.cookie = `${TOKEN_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  
  console.log('Authentication token removed from storage and cookies');
  
  // Return true to indicate successful removal
  return true;
}

/**
 * Checks if the token has expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} True if the token has expired, false otherwise
 */
export function isTokenExpired(token) {
  if (!token) return true;
  
  const decodedToken = decodeJwt(token);
  if (!decodedToken || !decodedToken.exp) return true;
  
  // exp is in seconds, current time needs to be in seconds too
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
}

/**
 * Gets user info from the JWT token
 * @returns {Object|null} User information or null if not logged in
 */
export function getUserInfo() {
  const token = getAuthToken();
  if (!token) return null;
  
  const decodedToken = decodeJwt(token);
  if (!decodedToken) return null;
  
  // Log decoded token for debugging
  console.log("Decoded token:", decodedToken);
  
  return {
    userId: decodedToken.user_id,
    profileImage: decodedToken.image,
    name: decodedToken.name || decodedToken.full_name,
    email: decodedToken.email,
    exp: decodedToken.exp ? new Date(decodedToken.exp * 1000).toLocaleString() : null,
    // Add any other properties from your token here
  };
}

/**
 * Checks if the user is authenticated with a valid, non-expired token
 * @returns {boolean} True if the user is authenticated, false otherwise
 */
export function isAuthenticated() {
  const token = getAuthToken();
  return !!token && !isTokenExpired(token);
}

/**
 * Logs the user out by removing the token and redirecting
 * @param {string} [redirectUrl='/signin'] - URL to redirect to after logout
 */
export function logout(redirectUrl = '/signin') {
  removeAuthToken();
  
  // If we're in a browser context, redirect
  if (typeof window !== 'undefined') {
    window.location.href = redirectUrl;
  }
  
  return true;
}
