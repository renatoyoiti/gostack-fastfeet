import express, { Router } from 'express';
import multer from 'multer';

import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import CepController from './app/controllers/CepController';
import DeliverymanController from './app/controllers/DeliverymanController';
import AvatarController from './app/controllers/AvatarController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliverymanSessionController from './app/controllers/DeliverymanSessionController';
import OrderController from './app/controllers/OrderController';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/sessions/deliverymans', DeliverymanSessionController.store);

routes.use(authMiddleware);
routes.use(express.urlencoded({ extended: true }));

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.get('/recipients/:id', RecipientController.show);
routes.delete('/recipients/:id', RecipientController.destroy);

routes.post('/ceps', CepController.store);

routes.get('/deliverymans/:id/deliveries', OrderController.index);
routes.post('/deliverymans', DeliverymanController.store);
routes.get('/deliverymans', DeliverymanController.index);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.destroy);

routes.post(
  '/deliverymans/:id/avatars',
  upload.single('file'),
  AvatarController.store
);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.destroy);

export default routes;
