import * as Yup from 'yup';
import { addMonths, format, parseISO } from 'date-fns';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Subscription from '../models/Subscription';

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
    return res.json(subs);
  }
}

export default new SubscriptionController();
