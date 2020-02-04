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
import SignatureController from './app/controllers/SignatureController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import CancelDeliveryProblemController from './app/controllers/CancelDeliveryProblemController';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/sessions/deliverymen', DeliverymanSessionController.store);

routes.use(authMiddleware);
routes.use(express.urlencoded({ extended: true }));

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.get('/recipients/:id', RecipientController.show);
routes.delete('/recipients/:id', RecipientController.destroy);

routes.post('/ceps', CepController.store);

routes.get('/deliverymen/:id/deliveries', OrderController.index);
routes.get(
  '/deliverymen/:deliverymanId/deliveries/:deliveryId',
  OrderController.show
);
routes.post(
  '/deliverymen/:deliverymanId/deliveries/:deliveryId',
  OrderController.store
);
routes.delete(
  '/deliverymen/:deliverymanId/deliveries/:deliveryId',
  OrderController.delete
);
routes.post('/deliverymen', DeliverymanController.store);
routes.get('/deliverymen', DeliverymanController.index);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.destroy);

routes.post(
  '/deliverymen/:id/avatars',
  upload.single('file'),
  AvatarController.store
);

routes.post(
  '/deliverymen/:deliverymanId/deliveries/:deliveryId/signature',
  upload.single('file'),
  SignatureController.store
);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.destroy);

routes.get('/deliveries/problems', DeliveryProblemController.index);
routes.post('/deliveries/:id/problems', DeliveryProblemController.store);

routes.delete(
  '/problems/:id/cancel-delivery',
  CancelDeliveryProblemController.destroy
);

export default routes;
