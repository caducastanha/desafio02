import * as Yup from 'yup';
import { addMonths, parseISO, format } from 'date-fns';
import { pt } from 'date-fns/locale';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Subscription from '../models/Subscription';
import Mail from '../../lib/Mail';

class SubscriptionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
    });

    const isValid = await schema.isValid(req.body);

    if (!isValid) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { start_date, student_id, plan_id } = req.body;

    const isStudent = await Student.findByPk(student_id);

    if (!isStudent) {
      return res.status(401).json({ error: 'Student not exists' });
    }

    const isPlan = await Plan.findByPk(plan_id);

    if (!isPlan) {
      return res.status(401).json({ error: 'Plan not exists' });
    }

    const date = parseISO(start_date);

    const endDate = addMonths(date, isPlan.duration);

    const price = isPlan.price * isPlan.duration;

    const subs = await Subscription.create({
      start_date: date,
      end_date: endDate,
      price,
      student_id,
      plan_id,
    });

    await Mail.sendMail({
      to: `${isStudent.name} <${isStudent.email}>`,
      subject: 'Matricula realizada',
      template: 'subscription',
      context: {
        student: isStudent.name,
        plan: isPlan.title,
        date: format(endDate, "dd'/'MM'/'yyyy", { locale: pt }),
        price: subs.price.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        }),
      },
    });

    return res.json(subs);
  }
}

export default new SubscriptionController();
