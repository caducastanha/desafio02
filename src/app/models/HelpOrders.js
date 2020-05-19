import Sequelize, { Model } from 'sequelize';

class HelpOrders extends Model {
  static init(sequelize) {
    super.init(
      {
        question: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        answer: {
          type: Sequelize.STRING,
        },
        answer_at: {
          type: Sequelize.DATE,
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }
}

export default HelpOrders;
