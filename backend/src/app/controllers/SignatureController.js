import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Signature from '../models/Signature';

class SignatureController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

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
        end_date: {
          [Op.not]: null,
        },
        start_date: {
          [Op.not]: null,
        },
      },
      attributes: ['id', 'deliveryman_id', 'end_date', 'endDt'],
      include: [
        {
          model: Signature,
          as: 'signature',
          attributes: ['name', 'path'],
        },
      ],
    });

    if (!delivery) {
      return res.status(401).json({
        error: 'Unauthorized. It must be finished to send a signature',
      });
    }

    const signature = await Signature.create({
      name,
      path,
    });

    if (!signature) {
      return res.status(500).json({
        error: 'Internal server error',
      });
    }

    delivery.signature_id = signature.id;

    await delivery.save();

    return res.json({
      delivery,
      signature,
    });
  }
}

export default new SignatureController();
