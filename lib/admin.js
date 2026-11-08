export const ADMIN_EMAIL = 'maavelionam2kbc@gmail.com';

export function isAdminEmail(email) {
  return email?.trim().toLowerCase() === ADMIN_EMAIL;
}
