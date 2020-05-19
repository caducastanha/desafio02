import Student from '../models/Student';

export default async (req, res, next) => {
  const { id } = req.params;

  const studentExists = await Student.findByPk(id);

  if (!studentExists) {
    return res.status(400).json({ error: 'Student not exists' });
  }

  return next();
};
