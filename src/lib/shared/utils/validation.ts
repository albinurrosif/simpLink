export const validateUsername = (username: string | undefined): string | null => {
  if (username === undefined) return null;

  const u = username.trim();
  if (u === '' || u.length < 3 || u.length > 20 || !/^[a-zA-Z0-9_]+$/.test(u)) {
    return 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores';
  }

  return null;
};
