// Session state cached client-side for UI only. The real auth lives in an
// httpOnly cookie set by the backend (not accessible to JS — safe from XSS).
const EMAIL_KEY = "binani_admin_email";

export function saveEmail(email) {
  if (email) sessionStorage.setItem(EMAIL_KEY, email);
}

export function clearEmail() {
  sessionStorage.removeItem(EMAIL_KEY);
}

export function getEmail() {
  return sessionStorage.getItem(EMAIL_KEY);
}
