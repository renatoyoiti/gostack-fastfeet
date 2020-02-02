import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient } = data;
    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Você tem uma nova entrega!',
      template: 'delivery',
      context: {
        deliveryman: deliveryman.name,
        recipient: recipient.name,
        state: recipient.state,
        city: recipient.city,
        cep: recipient.cep,
        neighborhood: recipient.neighborhood,
        street: recipient.street,
        number: recipient.number,
        complement: recipient.complement,
      },
    });
  }
}

export default new NewDeliveryMail();
