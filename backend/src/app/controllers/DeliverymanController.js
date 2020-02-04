import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const emailExists = await Deliveryman.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (emailExists) {
      return res.status(400).json({
        error: 'The email already exists',
      });
    }

    const { id, name, email } = await Deliveryman.create(req.body);

    if (!id) {
      return res.status(500).json({
        error: 'Internal server error',
      });
    }

    return res.json({
      id,
      name,
      email,
    });
  }

  async index(req, res) {
    const { page } = req.query;

    if (!page) {
      return res.status(500).json({
        error: 'Page not provided',
      });
    }

    const deliverymen = await Deliveryman.findAll({
      order: ['name'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (!deliverymen) {
      return res.status(500).json({
        error: 'Internal server error',
      });
    }

    return res.json(deliverymen);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { id } = req.params;

    const deliveryman = await Deliveryman.findOne({
      where: {
        id,
      },
    });

    if (!deliveryman) {
      return res.status(400).json({
        error: 'Deliveryman not found',
      });
    }

    const { email } = req.body;

    if (email && email !== deliveryman.email) {
      const emailExists = await Deliveryman.findOne({
        where: {
          email,
        },
      });

      if (emailExists) {
        return res.status(400).json({
          error: 'E-mail already exists',
        });
      }
    }

    await deliveryman.update(req.body);

    return res.json(deliveryman);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findOne({
      where: {
        id,
      },
    });

    if (!deliveryman) {
      return res.status(400).json({
        error: 'Deliveryman not found',
      });
    }

    await deliveryman.destroy();

    return res.json();
  }
}

export default new DeliverymanController();
