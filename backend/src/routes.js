import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import CepController from './app/controllers/CepController';
import DeliverymanController from './app/controllers/DeliverymanController';

const routes = Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/ceps', CepController.store);

routes.post('/deliverymans', DeliverymanController.store);
routes.get('/deliverymans', DeliverymanController.index);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.destroy);

export default routes;
