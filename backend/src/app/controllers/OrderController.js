import { format, parseISO } from 'date-fns';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';

class OrderController {
  async index(req, res) {
    const { id } = req.params;
    const { page } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: null,
      },
      attributes: ['id', 'recipient_id', 'createdAt', 'date'],
      order: [['createdAt', 'desc']],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'cep',
            'neighborhood',
            'street',
            'complement',
            'number',
            'state',
            'city',
          ],
        },
      ],
    });

    if (!deliveries) {
      return res.status(400).json({
        error: 'Deliveries not found',
      });
    }

    return res.json(deliveries);
  }
}

export default new OrderController();
