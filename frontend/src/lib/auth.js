const TOKEN_KEY = "binani_admin_token";
const EMAIL_KEY = "binani_admin_email";

export function saveSession(token, email) {
  localStorage.setItem(TOKEN_KEY, token);
  if (email) localStorage.setItem(EMAIL_KEY, email);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getEmail() {
  return localStorage.getItem(EMAIL_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}
