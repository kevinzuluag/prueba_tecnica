import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(__dirname, '../data/users.json');

export function getAllUsers() {
  const data = readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

export function getUserById(id) {
  const users = getAllUsers();
  return users.find((u) => u.id === String(id)) ?? null;
}

export function getUserByEmail(email, excludeId = null) {
  if (!email || typeof email !== 'string') return null;
  const users = getAllUsers();
  const emailLower = email.trim().toLowerCase();
  return users.find(
    (u) =>
      u.email &&
      u.email.trim().toLowerCase() === emailLower &&
      (excludeId == null || u.id !== String(excludeId))
  ) ?? null;
}

export function createUser(userData) {
  const users = getAllUsers();
  const maxId = users.reduce((max, u) => Math.max(max, parseInt(u.id, 10) || 0), 0);
  const newUser = {
    id: String(maxId + 1),
    ...userData,
  };
  users.push(newUser);
  writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
  return newUser;
}

export function updateUser(id, userData) {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === String(id));
  if (index === -1) return null;
  users[index] = { ...users[index], ...userData };
  writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
  return users[index];
}

export function deleteUser(id) {
  const users = getAllUsers().filter((u) => u.id !== String(id));
  if (users.length === getAllUsers().length) return null;
  writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
  return true;
}

export function saveUsers(users) {
  writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
}
