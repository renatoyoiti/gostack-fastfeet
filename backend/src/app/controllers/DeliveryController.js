import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Delivery from '../models/Delivery';
// import Queue from '../../lib/Queue';
// import NewDeliveryMail from '../jobs/NewDeliveryMail';
// import CancellationDeliveryMail from '../jobs/CancellationDeliveryMail';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.string().required(),
      recipient_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { deliveryman_id, recipient_id, product } = req.body;

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

    // await Queue.add(NewDeliveryMail.key, {
    //   deliveryman,
    //   recipient,
    // });

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

    const delivery = await Delivery.findByPk(id, {
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
    });

    if (!delivery) {
      return res.status(400).json({
        error: 'Delivery not found',
      });
    }

    if (delivery.canceled_at) {
      return res.status(401).json({
        error: 'This delivery is already canceled',
      });
    }

    if (delivery.start_date) {
      return res.status(401).json({
        error: 'This delivery is already on course to final destiny',
      });
    }

    if (delivery.end_date) {
      return res.status(401).json({
        error: "You can't cancel a delivery that is already finished",
      });
    }

    delivery.canceled_at = new Date();

    await delivery.save();

    // await Queue.add(CancellationDeliveryMail.key, {
    //   delivery,
    // });

    return res.json(delivery);
  }

  async update(req, res) {
    if (req.body.recipient_id || req.body.deliveryman_id) {
      return res.status(401).json({
        error: "It's not permitted to change de recipient or the deliveryman",
      });
    }

    const schema = Yup.object().shape({
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { id } = req.params;

    const delivery = await Delivery.findOne({
      where: {
        id,
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
    });

    if (!delivery) {
      return res.status(400).json({
        error: 'Delivery not found',
      });
    }

    await delivery.update(req.body);

    return res.json(delivery);
  }
}

export default new DeliveryController();
