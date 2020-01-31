import cep from 'cep-promise';
import * as Yup from 'yup';

class CepController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipientCep: Yup.string()
        .required()
        .min(8)
        .max(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Cep is not valid',
      });
    }

    const { recipientCep } = req.body;

    const onlyNumbers = Number(recipientCep);

    if (!onlyNumbers) {
      return res.status(400).json({
        error: 'CEP can only be numbers',
      });
    }

    const address = await cep(recipientCep).catch(err => null);

    if (!address) {
      return res.status(400).json({
        error: 'The cep provided could not be found.',
      });
    }

    return res.json(address);
  }
}

export default new CepController();
