import {
	Sequelize,
	DataTypes
} from 'sequelize';

export const sequelize = new Sequelize('sqlite:data.db');
export const User = sequelize.define(
	'User',
	{
		userId: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		currency: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false
		},
		itemsJSONString: {
			type: DataTypes.TEXT,
			defaultValue: '',
			allowNull: false
		}
	}
);

export async function dbInit() {
    await sequelize.sync({ force: true }); // TODO: Remove force: true
}