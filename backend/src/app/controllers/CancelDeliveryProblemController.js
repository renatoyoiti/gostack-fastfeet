import { Op } from 'sequelize';
import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';
import Queue from '../../lib/Queue';
import Deliveryman from '../models/Deliveryman';

class CancelDeliveryProblemController {
  async destroy(req, res) {
    const schema = Yup.object().shape({
      deliveryId: Yup.number().required(),
      deliverymanId: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { id } = req.params;
    const { deliveryId, deliverymanId } = req.body;

    const problem = await DeliveryProblem.findOne({
      where: {
        id,
        delivery_id: deliveryId,
      },
    });

    if (!problem) {
      return res.status(400).json({
        error: 'The delivery does not have any problem registered',
      });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: deliveryId,
        deliveryman_id: deliverymanId,
        end_date: {
          [Op.is]: null,
        },
      },
      attributes: ['id', 'canceled_at', 'cancelDt'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!delivery) {
      return res.status(401).json({
        error: "You can't cancel a finished delivery",
      });
    }

    const cancelDt = new Date();
    delivery.canceled_at = cancelDt;
    delivery.problem_id = id;

    await delivery.save();

    await Queue.sendMail({
      problem,
      delivery,
    });

    return res.json();
  }
}

export default new CancelDeliveryProblemController();
