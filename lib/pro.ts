export function isProUser(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isProUser') === 'true';
}
