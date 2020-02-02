import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Delivery from '../models/Delivery';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.string().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { id: deliveryman_id } = req.params;

    const deliveryman = await Deliveryman.findOne({
      where: {
        id: deliveryman_id,
      },
    });

    if (!deliveryman) {
      return res.status(400).json({
        error: 'Deliveryman not found',
      });
    }

    const { recipient_id, product } = req.body;

    const recipient = await Recipient.findOne({
      where: {
        id: recipient_id,
      },
    });

    if (!recipient) {
      return res.status(400).json({
        error: 'Recipient not found',
      });
    }

    const delivery = await Delivery.create({
      recipient_id,
      deliveryman_id,
      product,
    });

    if (!delivery) {
      return res.status(500).json({
        error: 'Internal server error',
      });
    }

    return res.json(delivery);
  }

  async index(req, res) {
    const { page } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        canceled_at: null,
        start_date: null,
        end_date: null,
      },
      attributes: ['id', 'recipient_id', 'deliveryman_id', 'product'],
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
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (!deliveries) {
      return res.status(400).json({
        error: 'Deliveries not found',
      });
    }

    return res.json(deliveries);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({
        error: 'Delivery not found',
      });
    }

    return res.json();
  }
}

export default new DeliveryController();
