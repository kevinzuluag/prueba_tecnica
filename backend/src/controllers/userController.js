import * as userService from '../services/userService.js';

export function listUsers(req, res, next) {
  try {
    const { search, city, country, company } = req.query;
    const users = userService.getUsers({ search, city, country, company });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export function getUserById(req, res, next) {
  try {
    const user = userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export function createUser(req, res, next) {
  try {
    const user = userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.message === 'El email ya está registrado') {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
}

export function getFilters(req, res, next) {
  try {
    const cities = userService.getUniqueCities();
    const countries = userService.getUniqueCountries();
    const companies = userService.getUniqueCompanies();
    res.json({ cities, countries, companies });
  } catch (err) {
    next(err);
  }
}

export function updateUser(req, res, next) {
  try {
    const updated = userService.updateUser(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(updated);
  } catch (err) {
    if (err.message === 'El email ya está registrado') {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
}

export function deleteUser(req, res, next) {
  try {
    const deleted = userService.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
