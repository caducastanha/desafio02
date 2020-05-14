import Subscription from '../models/Subscription';

export default async (req, res, next) => {
  const { student_id } = req.body;

  const subs = await Subscription.findOne({
    where: {
      student_id,
    },
  });

  if (subs) {
    return res.status(400).json({ error: 'Student subscribed' });
  }
  return next();
};
