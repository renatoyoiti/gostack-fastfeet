import { format, parseISO } from 'date-fns';

import Mail from '../../lib/Mail';

class CancellationDeliveryProblemMail {
  get key() {
    return 'CancellationDeliveryProblemMail';
  }

  async handle({ data }) {
    const { delivery, problem } = data;
    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'A entrega foi cancelada devido á um problema!',
      template: 'deliveryProblemCancellation',
      context: {
        deliveryman: delivery.deliveryman.name,
        description: problem.description,
        delivery: delivery.id,
        date: format(parseISO(delivery.cancelDt), "dd/MM/yyyy 'às' HH:mm'h'"),
      },
    });
  }
}

export default new CancellationDeliveryProblemMail();
