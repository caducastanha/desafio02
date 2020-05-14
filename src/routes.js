import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';
import subsMiddleware from './app/middlewares/subscription';
import studentMiddleware from './app/middlewares/student';
import PlanController from './app/controllers/PlanController';
import SubscriptionController from './app/controllers/SubscriptionController';

const routes = Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students', studentMiddleware, StudentController.update);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/subscriptions', subsMiddleware, SubscriptionController.store);
routes.get('/subscriptions', SubscriptionController.index);
routes.put('/subscriptions/:id', SubscriptionController.update);

export default routes;
