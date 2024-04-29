import { Document, models } from 'mongoose'
import { IUser } from './user'
import mongoose, { Schema } from 'mongoose'

//client side
export interface ICommentBase {
	user: IUser
	text: string
}

//need these on server side
export interface IComment extends Document, ICommentBase {
	//_id: string
	createdAt: Date
	updatedAt: Date
}

//comment schema
const CommentSchema: Schema<IComment> = new Schema<IComment>(
	{
		user: {
			userId: { type: String, required: true },
			userImage: { type: String, required: true },
			firstName: { type: String, required: true },
			lastName: { type: String, required: false }
		},
		text: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
)

//first check if the model already initialized
export const Comment =
	models.Comment || mongoose.model<IComment>('Comment', CommentSchema)
