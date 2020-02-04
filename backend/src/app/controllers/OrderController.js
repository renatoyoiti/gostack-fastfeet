import {
  isBefore,
  isAfter,
  parseISO,
  format,
  setSeconds,
  setHours,
  setMinutes,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { fn, col, Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';

class OrderController {
  async index(req, res) {
    const { id } = req.params;
    const { page } = req.query;

    if (id !== req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: null,
      },
      attributes: [
        'id',
        'deliveryman_id',
        'created_at',
        'canceled_at',
        'start_date',
        'end_date',
        'createDt',
        'startDt',
        'endDt',
        'cancelDt',
      ],
      order: [['created_at', 'desc']],
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

  async show(req, res) {
    const { deliverymanId, deliveryId } = req.params;

    if (deliverymanId !== req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: deliveryId,
        deliveryman_id: deliverymanId,
      },
      attributes: [
        'id',
        'deliveryman_id',
        'created_at',
        'canceled_at',
        'start_date',
        'end_date',
        'createDt',
        'startDt',
        'endDt',
        'cancelDt',
      ],
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

    if (!delivery) {
      return res.status(400).json({
        error: 'Delivery not found',
      });
    }

    const {
      id,
      deliveryman_id,
      createDt,
      startDt,
      endDt,
      cancelDt,
      recipient,
    } = delivery;

    return res.json({
      id,
      deliveryman_id,
      createDt,
      startDt,
      endDt,
      cancelDt,
      recipient,
    });
  }

  async store(req, res) {
    // insert start date
    const { deliverymanId, deliveryId } = req.params;

    if (deliverymanId !== req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: deliveryId,
        deliveryman_id: deliverymanId,
      },
      attributes: ['id', 'deliveryman_id', 'start_date', 'startDt'],
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

    if (!delivery) {
      return res.status(400).json({
        error: 'Delivery not found',
      });
    }

    if (delivery.canceled_at) {
      return res.status(401).json({
        error: "Unauthorized. You can't withdrawn a canceled delivery",
      });
    }

    if (delivery.end_date) {
      return res.status(401).json({
        error: "Unauthorized. You can't withdrawn a finished delivery.",
      });
    }

    if (delivery.start_date) {
      return res.status(401).json({
        error: 'Unauthorized. You already withdrew this delivery.',
      });
    }

    const searchDate = new Date().getTime();
    const dateNow = new Date();
    const offset = new Date().getTimezoneOffset();
    const startDate = dateNow - offset;

    const workStart = format(
      setSeconds(setMinutes(setHours(searchDate, 8), 0), 0),
      "yyyy-MM-dd'T'HH:mm:ssxxx"
    );

    const workEnd = format(
      setSeconds(setMinutes(setHours(searchDate, 18), 0), 0),
      "yyyy-MM-dd'T'HH:mm:ssxxx"
    );

    if (
      isAfter(startDate, parseISO(workEnd)) ||
      isBefore(startDate, parseISO(workStart))
    ) {
      return res.status(401).json({
        error: "You can only withdraw a delivery between 8 and 18 o'clock",
      });
    }

    const { dataValues: orderLimit } = await Delivery.findOne({
      where: {
        deliveryman_id: deliverymanId,
        start_date: {
          [Op.between]: [startOfDay(startDate), endOfDay(startDate)],
        },
      },
      attributes: [[fn('COUNT', col('start_date')), 'no_withdrawn']],
    });

    const { no_withdrawn } = orderLimit;

    if (no_withdrawn === '5') {
      return res.status(401).json({
        error:
          'Delivery withdraw limit reached. You can only withdraw 5 deliveries per day',
      });
    }

    delivery.start_date = startDate + offset;

    const { id, deliveryman_id, startDt, recipient } = await delivery.save();

    return res.json({ id, deliveryman_id, startDt, recipient });
  }

  async delete(req, res) {
    // insert end date
    const { deliverymanId, deliveryId } = req.params;

    if (deliverymanId !== req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: deliveryId,
        deliveryman_id: deliverymanId,
        end_date: null,
      },
      attributes: [
        'id',
        'deliveryman_id',
        'start_date',
        'startDt',
        'canceled_at',
        'end_date',
        'endDt',
      ],
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

    if (!delivery.start_date) {
      return res.status(401).json({
        error: "Unauthorized. You can't finish unstarted deliveries",
      });
    }

    if (delivery.canceled_at) {
      return res.status(401).json({
        error: "Unauthorized. You can't finish canceled deliveries",
      });
    }

    if (delivery.end_date) {
      return res.status(401).json({
        error: 'Unauthorized. The delivery is already finished.',
      });
    }

    delivery.end_date = new Date();

    await delivery.save();

    return res.json(delivery);
  }
}

export default new OrderController();
