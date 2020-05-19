import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';

class QuestionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    const isValid = await schema.isValid(req.body);

    if (!isValid) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id: student_id } = req.params;
    const { question } = req.body;

    const helpOrder = await HelpOrders.create({
      student_id,
      question,
    });

    return res.json(helpOrder);
  }

  async index(req, res) {
    const { id: student_id } = req.params;

    const helpOrders = await HelpOrders.findAll({
      where: {
        student_id,
      },
    });

    return res.json(helpOrders);
  }
}

export default new QuestionController();
