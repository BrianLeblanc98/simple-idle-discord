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
			allowNull: false,
			primaryKey: true
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

/** Initialize the database */
export async function dbInit() {
    await sequelize.sync(); // TODO: Remove force: true
}

/** Returns user object based on id, creates new entry if they don't exist */
export async function dbGetUser(userId) {
	let user = await User.findOne({ where: { userId }});
	if (!user) user = await User.create({ userId });
	return user;
}

/** Add currency to user */
export async function dbAddCurrency(user, amount) {
	await user.increment('currency', { by: amount });
	return user.reload();
}