import * as Yup from 'yup';
import Student from '../models/Student';

export default async (req, res, next) => {
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
  const { email } = req.body;

  const studentExists = await Student.findOne({ where: { email } });

  if (!studentExists) {
    return res.status(400).json({ error: 'Student not exists.' });
  }
  req.body.id = studentExists.id;
  return next();
};
