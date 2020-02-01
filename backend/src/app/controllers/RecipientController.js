import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .max(255),
      cep: Yup.string()
        .required()
        .min(8)
        .max(8),
      neighborhood: Yup.string()
        .required()
        .max(255),
      street: Yup.string()
        .required()
        .max(255),
      number: Yup.string()
        .required()
        .max(255),
      complement: Yup.string().max(255),
      state: Yup.string()
        .required()
        .min(2)
        .max(2),
      city: Yup.string()
        .required()
        .max(255),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const {
      id,
      name,
      cep,
      neighborhood,
      street,
      number,
      complement,
      state,
      city,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      cep,
      neighborhood,
      street,
      number,
      complement,
      state,
      city,
    });
  }

  async index(req, res) {
    const { page } = req.query;
    const recipients = await Recipient.findAll({
      order: ['name'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (!recipients) {
      return res.status(500).json({
        error: 'Internal server error',
      });
    }

    return res.json(recipients);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .max(255),
      cep: Yup.string()
        .required()
        .min(8)
        .max(8),
      neighborhood: Yup.string()
        .required()
        .max(255),
      street: Yup.string()
        .required()
        .max(255),
      number: Yup.string()
        .required()
        .max(255),
      complement: Yup.string().max(255),
      state: Yup.string()
        .required()
        .min(2)
        .max(2),
      city: Yup.string()
        .required()
        .max(255),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { id } = req.params;

    const recipient = await Recipient.findOne({
      where: {
        id,
      },
    });

    if (!recipient) {
      return res.status(400).json({
        error: 'Recipient not found',
      });
    }

    await recipient.update(req.body);

    return res.json(recipient);
  }

  async show(req, res) {
    const { id } = req.params;

    const recipient = Recipient.findOne({
      where: {
        id,
      },
    });

    if (!recipient) {
      return res.status(400).json({
        error: 'Recipient not found',
      });
    }

    return res.json(recipient);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findOne({
      where: {
        id,
      },
    });

    if (!recipient) {
      return res.status(400).json({
        error: 'Recipient not found',
      });
    }

    await recipient.destroy();

    return res.json();
  }
}

export default new RecipientController();
