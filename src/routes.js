import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';
import studentMiddleware from './app/middlewares/student';

const routes = Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students', studentMiddleware, StudentController.update);

export default routes;
