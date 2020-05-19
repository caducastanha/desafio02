import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Subscription from '../models/Subscription';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

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

    await Queue.add(SubscriptionMail.key, {
      isStudent,
      isPlan,
      subs,
      endDate,
    });

    return res.json(subs);
  }

  async index(req, res) {
    const subs = await Subscription.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(subs);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      plan_id: Yup.number(),
    });

    const isValid = await schema.isValid(req.body);

    if (!isValid) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    req.params.id = parseInt(req.params.id, 10);
    const { id } = req.params;
    const { plan_id, start_date } = req.body;

    const sub = await Subscription.findByPk(id);

    if (!sub) {
      return res.status(401).json({ error: 'Subscription not exists' });
    }

    const isPlan = await Plan.findByPk(plan_id);

    if (!isPlan) {
      return res.status(401).json({ error: 'Plan not exists' });
    }

    const startDate = parseISO(start_date);

    const endDate = addMonths(startDate, isPlan.duration);

    const price = isPlan.price * isPlan.duration;

    const updated = await sub.update({
      start_date: startDate,
      end_date: endDate,
      price,
      plan_id,
    });

    return res.json(updated);
  }

  async delete(req, res) {
    req.params.id = parseInt(req.params.id, 10);
    const { id } = req.params;

    const subsExists = await Subscription.findByPk(id);

    if (!subsExists) {
      return res.status(400).json({ error: 'Subscription not exists' });
    }

    await subsExists.destroy(id);

    return res.json({ message: 'Subscription deleted' });
  }
}

export default new SubscriptionController();
