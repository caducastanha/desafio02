import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';
import studentMiddleware from './app/middlewares/student';
import PlanController from './app/controllers/PlanController';

const routes = Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students', studentMiddleware, StudentController.update);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);

export default routes;
