import mongoose from 'mongoose'

//connection string form azure cosmos db
const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@linkedin-2.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`

if (!connectionString) {
	throw new Error('Please provide a valid connection string')
}

//the following function will connect to the database
export const connectDB = async () => {
	if (mongoose.connection?.readyState >= 1) {
		console.log('----Already connected to MongoDB----')
		return
	}

	try {
		console.log('----Connecting to MongoDB----')
		await mongoose.connect(connectionString) //actually connecting to mongodb
	} catch (error) {
		console.log('Error connecting to MongoDB: ', error)
	}
}

// mongodb+srv://sroutfit:KillSwitchReact24@linkedin-2.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
