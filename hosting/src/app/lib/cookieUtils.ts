export function setCookie(name: string, value: string, seconds: number): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + seconds * 1000);
  
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; Secure; SameSite=Strict`;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}