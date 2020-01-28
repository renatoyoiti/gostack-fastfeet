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
}

export default new RecipientController();
