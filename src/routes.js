import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';
import subsMiddleware from './app/middlewares/subscription';
import studentMiddleware from './app/middlewares/student';
import PlanController from './app/controllers/PlanController';
import SubscriptionController from './app/controllers/SubscriptionController';
import CheckinController from './app/controllers/CheckinController';
import QuestionController from './app/controllers/QuestionController';
import isStudentMiddleware from './app/middlewares/isStudent';
import AnswerController from './app/controllers/AnswerController';

const routes = Router();

routes.post('/sessions', SessionController.store);

routes.post(
  '/students/:id/checkins',
  isStudentMiddleware,
  CheckinController.store
);
routes.get(
  '/students/:id/checkins',
  isStudentMiddleware,
  CheckinController.index
);

routes.post(
  '/students/:id/help-orders',
  isStudentMiddleware,
  QuestionController.store
);
routes.get(
  '/students/:id/help-orders',
  isStudentMiddleware,
  QuestionController.index
);

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
routes.delete('/subscriptions/:id', SubscriptionController.delete);

routes.get('/help-orders', AnswerController.index);

routes.post('/help-orders/:id/answer', AnswerController.store);

export default routes;
