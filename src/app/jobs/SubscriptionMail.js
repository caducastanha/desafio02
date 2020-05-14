import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { isStudent, isPlan, subs, endDate } = data;

    await Mail.sendMail({
      to: `${isStudent.name} <${isStudent.email}>`,
      subject: 'Matricula realizada',
      template: 'subscription',
      context: {
        student: isStudent.name,
        plan: isPlan.title,
        date: format(parseISO(endDate), "dd'/'MM'/'yyyy", { locale: pt }),
        price: subs.price.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        }),
      },
    });
  }
}

export default new SubscriptionMail();
