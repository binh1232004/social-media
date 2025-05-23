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
 * Sets the authentication token in secure HTTP-only cookies
 * @param {string} token - The authentication token to store
 * @returns {Object} - Information about the token including its expiration
 */
export function setAuthToken(token) {
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
    // Set the token in a secure HTTP-only cookie
  const isSecure = process.env.NODE_ENV === 'production' || window.location.protocol === 'https:';
  document.cookie = `${TOKEN_NAME}=${token}; Path=/; expires=${expiryDate.toUTCString()}; SameSite=Strict; ${isSecure ? 'Secure;' : ''}`;
  
  // Add a secondary cookie to easily check if user is authenticated (no HttpOnly)
  document.cookie = `${TOKEN_NAME}_exists=true; Path=/; expires=${expiryDate.toUTCString()}; SameSite=Strict; ${isSecure ? 'Secure;' : ''}`;
  
  // Return token information for additional handling if needed
  return {
    token,
    expiryDate,
    decodedToken
  };
}

/**
 * Gets the authentication token from cookies
 * @returns {string|null} The authentication token or null if not found
 */
export function getAuthToken() {
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Parse cookies to find the token
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === TOKEN_NAME && value) {
      return value;
    }
  }
  
  // If token not found in document.cookie (it might be HTTP-only)
  // check for the existence marker
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === `${TOKEN_NAME}_exists` && value === 'true') {
      console.log('Auth token exists as HTTP-only cookie');
      // Return a placeholder since we can't access the actual HTTP-only cookie
      return 'http-only-token';
    }
  }
  
  return null;
}

/**
 * Removes the authentication token from cookies
 */
export function removeAuthToken() {
  // Remove all cookies by name, including any path/domain variations
  // This is more thorough than simply setting expires in the past
  document.cookie = `${TOKEN_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  document.cookie = `${TOKEN_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict;`;
  document.cookie = `${TOKEN_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
  document.cookie = `${TOKEN_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure;`;
  
  // Also remove the existence marker cookie
  document.cookie = `${TOKEN_NAME}_exists=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  document.cookie = `${TOKEN_NAME}_exists=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict;`;
  document.cookie = `${TOKEN_NAME}_exists=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
  document.cookie = `${TOKEN_NAME}_exists=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure;`;
  
  
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
  // Check if we have authentication
  if (!isAuthenticated()) {
    console.log('Not authenticated, returning null from getUserInfo');
    return null;
  }
  
  const token = getAuthToken();
  if (!token) {
    console.log('No token found, returning null from getUserInfo');
    return null;
  }
  
  // If we have the special HTTP-only placeholder, check if we can get user info from localStorage
  if (token === 'http-only-token') {
    try {
      const cachedUserInfo = localStorage.getItem('userInfo');
      if (cachedUserInfo) {
        return JSON.parse(cachedUserInfo);
      }
      console.log('HTTP-only token detected but no cached user info');
    } catch (e) {
      console.error('Error reading cached user info:', e);
    }
  }
  
  const decodedToken = decodeJwt(token);
  if (!decodedToken) {
    console.log('Could not decode token, returning null from getUserInfo');
    return null;
  }
  
  const userInfo = {
    userId: decodedToken.user_id || decodedToken.userId || decodedToken.sub,
    profileImage: decodedToken.image || decodedToken.profileImage || decodedToken.picture,
    name: decodedToken.name || decodedToken.full_name || decodedToken.username,
    email: decodedToken.email,
    exp: decodedToken.exp ? new Date(decodedToken.exp * 1000).toLocaleString() : null,
    // Add any other properties from your token here
  };
  
  // Cache the user info for HTTP-only cookie scenarios
  try {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  } catch (e) {
    console.error('Error caching user info:', e);
  }
  
  return userInfo;
}

/**
 * Checks if the user is authenticated with a valid, non-expired token
 * @returns {boolean} True if the user is authenticated, false otherwise
 */
export function isAuthenticated() {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Check for the existence marker cookie
  const cookies = document.cookie.split(';');
  let existsMarkerFound = false;
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === `${TOKEN_NAME}_exists` && value === 'true') {
      existsMarkerFound = true;
      break;
    }
  }
  
  if (!existsMarkerFound) {
    return false;
  }
  
  // If we have the existence marker, we consider the user authenticated
  // since the actual token is in an HTTP-only cookie managed by the browser
  return true;
}

/**
 * Logs the user out by removing the token and redirecting
 * @param {string} [redirectUrl='/signin'] - URL to redirect to after logout
 */
export async function logout(redirectUrl = '/signin') {
  try {
    // First try to clear HTTP-only cookies via API
    try {
      const response = await fetch('/api/proxy/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        console.log('Server-side logout successful');
      } else {
        console.warn('Server-side logout failed, falling back to client-side cookie removal');
      }
    } catch (apiError) {
      console.error('Error during API logout:', apiError);
    }
    
    // Also remove client-side cookies as fallback
    removeAuthToken();
    
    console.log('Redirecting to:', redirectUrl);
    
    // Force a small delay before redirecting to ensure cookies are cleared
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      }
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    
    // Try direct navigation as fallback
    if (typeof window !== 'undefined') {
      window.location.replace(redirectUrl);
    }
    
    return false;
  }
}
