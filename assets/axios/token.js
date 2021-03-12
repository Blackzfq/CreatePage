let TOKEN_NAME = `BLUEWALE_token`;

export function getToken() {
  return sessionStorage.getItem(TOKEN_NAME);
}
export function setToken(token) {
  sessionStorage.setItem(TOKEN_NAME, token);
}