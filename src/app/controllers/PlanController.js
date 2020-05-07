import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    const isValid = await schema.isValid(req.body);

    if (!isValid) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });
    req.params.id = parseInt(req.params.id, 10);
    const { id } = req.params;

    const isValid = await schema.isValid(req.body);

    if (!isValid) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const planExists = await Plan.findByPk(id);

    if (!planExists) {
      return res.status(400).json({ error: 'Plan not exists' });
    }

    const { title, duration, price } = await planExists.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    req.params.id = parseInt(req.params.id, 10);
    const { id } = req.params;

    const planExists = await Plan.findByPk(id);

    if (!planExists) {
      return res.status(400).json({ error: 'Plan not exists' });
    }

    await planExists.destroy(id);

    return res.json({ message: 'Plan deleted' });
  }
}

export default new PlanController();
