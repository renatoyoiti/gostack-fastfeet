import { format, parseISO } from 'date-fns';

import Mail from '../../lib/Mail';

class CancellationDeliveryMail {
  get key() {
    return 'CancellationDeliveryMail';
  }

  async handle({ data }) {
    const { delivery } = data;
    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'A entrega foi cancelada!',
      template: 'deliveryCancellation',
      context: {
        deliveryman: delivery.deliveryman.name,
        state: delivery.recipient.state,
        city: delivery.recipient.city,
        cep: delivery.recipient.cep,
        delivery: delivery.id,
        date: format(
          parseISO(delivery.canceled_at),
          "dd/MM/yyyy 'às' HH:mm'h'"
        ),
      },
    });
  }
}

export default new CancellationDeliveryMail();
