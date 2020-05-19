import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;

    helpOrder.createdAt = parseISO(helpOrder.createdAt);
    helpOrder.answer_at = parseISO(helpOrder.answer_at);

    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Auxílio de treino',
      template: 'answer',
      context: {
        student: helpOrder.student.name,
        question: helpOrder.question,
        questionDate: format(helpOrder.createdAt, "dd'/'MM'/'yyyy", {
          locale: pt,
        }),
        answer: helpOrder.answer,
        answerDate: format(helpOrder.answer_at, "dd'/'MM'/'yyyy", {
          locale: pt,
        }),
      },
    });
  }
}

export default new AnswerMail();
