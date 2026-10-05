export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const passwordRequirements = [
  { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'Contains a letter', test: (v: string) => /[A-Za-z]/.test(v) },
  { label: 'Contains a number', test: (v: string) => /[0-9]/.test(v) },
];

export function isPasswordValid(password: string) {
  return passwordRequirements.every((r) => r.test(password));
}