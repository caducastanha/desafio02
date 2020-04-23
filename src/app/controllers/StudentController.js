import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().email().required(),
      email: Yup.string().required(),
      age: Yup.string().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    const isValid = await schema.isValid(req.body);

    if (!isValid) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      student: {
        id,
        name,
        email,
        age,
        weight,
        height,
      },
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      newEmail: Yup.string().email(),
      email: Yup.string().email().required(),
      age: Yup.string(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    const isValid = await schema.isValid(req.body);

    if (!isValid) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { newEmail } = req.body;
    if (newEmail) {
      req.body.email = newEmail;
      const userExists = await Student.findOne({
        where: { email: newEmail },
      });
      if (userExists) {
        return res
          .status(400)
          .json({ error: 'Student with email already exists.' });
      }
    }

    const student = await Student.findByPk(req.body.id);
    const { id, name, email, age, weight, height } = await student.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentController();
