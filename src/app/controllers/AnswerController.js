import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';
import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';
import Student from '../models/Student';

class AnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    const isValid = await schema.isValid(req.body);

    if (!isValid) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id } = req.params;

    const orderExists = await HelpOrders.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!orderExists) {
      return res.status(400).json({ error: 'Help Order not exists' });
    }

    req.body.answer_at = new Date();

    const helpOrder = await orderExists.update(req.body);

    await Queue.add(AnswerMail.key, {
      helpOrder,
    });

    return res.json(helpOrder);
  }

  async index(req, res) {
    const helpOrders = await HelpOrders.findAll({
      where: {
        answer: null,
      },
    });

    return res.json(helpOrders);
  }
}

export default new AnswerController();
