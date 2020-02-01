import express, { Router } from 'express';
import multer from 'multer';

import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import CepController from './app/controllers/CepController';
import DeliverymanController from './app/controllers/DeliverymanController';
import AvatarController from './app/controllers/AvatarController';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.use(express.urlencoded({ extended: true }));

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.get('/recipients/:id', RecipientController.show);
routes.delete('/recipients/:id', RecipientController.destroy);

routes.post('/ceps', CepController.store);

routes.post('/deliverymans', DeliverymanController.store);
routes.get('/deliverymans', DeliverymanController.index);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.destroy);

routes.post(
  '/deliverymans/:id/avatars',
  upload.single('file'),
  AvatarController.store
);

export default routes;
