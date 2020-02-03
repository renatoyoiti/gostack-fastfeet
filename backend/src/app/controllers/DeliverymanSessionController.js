import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import Deliveryman from '../models/Deliveryman';

class DeliverymanSessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.string()
        .required()
        .min(6)
        .max(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { id } = req.body;

    const deliveryman = await Deliveryman.findOne({ where: { id } });

    if (!deliveryman) {
      return res.status(400).json({
        error: 'Deliveryman not found',
      });
    }

    const { name } = deliveryman;

    return res.json({
      deliveryman: {
        id,
        name,
      },
      token: jwt.sign({ id, name }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new DeliverymanSessionController();
