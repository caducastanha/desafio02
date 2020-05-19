import { Op } from 'sequelize';
import { subDays } from 'date-fns';
import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;

    const today = new Date();
    const lastDays = subDays(today, 6);

    const checkinValid = await Checkin.findAndCountAll({
      where: {
        student_id: id,
        created_at: {
          [Op.between]: [lastDays, today],
        },
      },
    });

    if (checkinValid.count >= 5) {
      return res
        .status(400)
        .json({ error: 'You have reached the check-in limit' });
    }

    const checkin = await Checkin.create({ student_id: id });

    return res.json(checkin);
  }

  async index(req, res) {
    const { id } = req.params;

    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
      },
      attributes: ['id'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(checkins);
  }
}

export default new CheckinController();
