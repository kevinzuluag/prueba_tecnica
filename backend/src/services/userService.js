import * as userModel from '../models/User.js';

export function getUsers(filters = {}) {
  let users = userModel.getAllUsers();

  const { search, city, country, company } = filters;

  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    users = users.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u.phone && u.phone.includes(term)) ||
        (u.city && u.city.toLowerCase().includes(term)) ||
        (u.country && u.country.toLowerCase().includes(term)) ||
        (u.company && u.company.toLowerCase().includes(term))
    );
  }

  if (city && city.trim()) {
    const cityLower = city.trim().toLowerCase();
    users = users.filter((u) => u.city && u.city.toLowerCase() === cityLower);
  }

  if (country && country.trim()) {
    const countryLower = country.trim().toLowerCase();
    users = users.filter((u) => u.country && u.country.toLowerCase() === countryLower);
  }

  if (company && company.trim()) {
    const companyLower = company.trim().toLowerCase();
    users = users.filter((u) => u.company && u.company.toLowerCase() === companyLower);
  }

  return users;
}

export function getUserById(id) {
  return userModel.getUserById(id);
}

export function createUser(userData) {
  if (userData.email && userModel.getUserByEmail(userData.email)) {
    throw new Error('El email ya está registrado');
  }
  return userModel.createUser(userData);
}

export function updateUser(id, userData) {
  if (userData.email && userModel.getUserByEmail(userData.email, id)) {
    throw new Error('El email ya está registrado');
  }
  return userModel.updateUser(id, userData);
}

export function deleteUser(id) {
  return userModel.deleteUser(id);
}

export function getUniqueCities() {
  const users = userModel.getAllUsers();
  const cities = [...new Set(users.map((u) => u.city).filter(Boolean))].sort();
  return cities;
}

export function getUniqueCountries() {
  const users = userModel.getAllUsers();
  const countries = [...new Set(users.map((u) => u.country).filter(Boolean))].sort();
  return countries;
}

export function getUniqueCompanies() {
  const users = userModel.getAllUsers();
  const companies = [...new Set(users.map((u) => u.company).filter(Boolean))].sort();
  return companies;
}
