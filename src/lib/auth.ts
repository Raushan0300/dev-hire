import { jwtDecode } from 'jwt-decode';

interface AuthUser {
  email: string;
  role: 'developer' | 'client';
}

interface DecodedToken {
  id: string;
  role: 'developer' | 'client';
  email: string;
}

export const saveAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const getUser = (): AuthUser | null => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      email: decoded.email,
      role: decoded.role
    };
  } catch {
    clearAuthToken(); // Clear invalid token
    return null;
  }
};

export const isSignedIn = () => {
  const token = localStorage.getItem("authToken"); // Example token logic
  if (!token){
    return false;
  } else {
    return true;
  }

  // Optionally validate token with an API
  // try {
  //     const response = await fetch("/api/validate-token", {
  //         headers: { Authorization: `Bearer ${token}` },
  //     });
  //     return response.ok;
  // } catch (error) {
  //     console.error("Token validation failed:", error);
  //     return false;
  // }
};