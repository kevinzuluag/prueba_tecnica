import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { validateUserCreate, handleValidationErrors } from '../middlewares/validateUser.js';

const router = Router();

router.get('/', userController.listUsers);
router.get('/filters', userController.getFilters);
router.get('/:id', userController.getUserById);
router.post('/', validateUserCreate, handleValidationErrors, userController.createUser);
router.put('/:id', validateUserCreate, handleValidationErrors, userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
