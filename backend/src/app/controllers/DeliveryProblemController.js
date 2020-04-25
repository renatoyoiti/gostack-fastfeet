import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import DeliveryProblem from '../models/DeliveryProblem';
import Recipient from '../models/Recipient';

class DeliveryProblemController {
  async index(req, res) {
    const { page } = req.query;

    const deliveryProblems = await DeliveryProblem.findAll({
      where: {
        delivery_id: {
          [Op.not]: null,
        },
      },
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ['id', 'description'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'created_at', 'createDt', 'start_date', 'startDt'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['id', 'cep', 'state', 'city'],
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findOne({
      where: {
        id,
        deliveryman_id: req.userId,
      },
      attributes: ['id', 'start_date', 'canceled_at'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!delivery) {
      return res.status(401).json({
        error: 'Delivery not found',
      });
    }

    if (!delivery.start_date) {
      return res.status(401).json({
        error:
          'Unauthorized. The delivery must de withdrawn before registering a problem',
      });
    }

    if (delivery.canceled_at) {
      return res.status(401).json({
        error:
          "Unauthorized. You can't register a problem for a canceled delivery",
      });
    }

    const { description } = req.body;

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id: id,
      description,
    });

    if (!deliveryProblem) {
      return res.status(500).json({
        error: 'Internal server error',
      });
    }

    return res.json(deliveryProblem);
  }
}

export default new DeliveryProblemController();
