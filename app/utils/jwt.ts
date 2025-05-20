interface DecodedToken {
  sub: string;  // subject (usually user id)
  role: string; // user role
  username: string;
  exp: number;  // expiration timestamp
  iat: number;  // issued at timestamp
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    // JWT tokens are made up of three parts: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const getUserRole = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

export const getUsername = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded?.username || null;
}; 