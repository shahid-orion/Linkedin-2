import { Comment, IComment, ICommentBase } from '@/types/comment'
import { IUser } from '@/types/user'
import mongoose, { Schema, Document, models, Model } from 'mongoose'

export interface IPostBase {
	user: IUser
	text: string
	imageUrl?: string
	comments?: IComment[]
	likes?: string
}

export interface IPost extends IPostBase, Document {
	createdAt: Date
	updatedAt: Date
}

// Define the document methods (for each instance of a post)
interface IPostMethods {
	likePost(userId: string): Promise<void>
	unlikePost(userId: string): Promise<void>
	commentOnPost(userId: ICommentBase): Promise<void>
	getAllComments(): Promise<IComment[]>
	removeComment(userId: string): Promise<void>
	removePost(): Promise<void>
}

//
interface IPostStatics {
	getAllPosts(): Promise<IPostDocument[]>
}

// Singular instance of a post
export interface IPostDocument extends IPost, IPostMethods {}

// All posts
interface IPostModel extends Model<IPostDocument>, IPostStatics {}

// Post Schema
const PostSchema: Schema<IPostDocument> = new Schema<IPostDocument>(
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
		},
		imageUrl: {
			type: String,
			required: false
		},
		comments: [
			{
				type: [Schema.Types.ObjectId],
				ref: 'Comment',
				default: []
			}
		],
		likes: {
			type: [String],
			required: false
		}
	},
	{
		timestamps: true
	}
)

// Like post
PostSchema.methods.likePost = async function (userId: string) {
	try {
		await this.updateOne({ $addToSet: { likes: userId } })
	} catch (error) {
		console.log('Railed to like the post', error)
	}
}

// Unlike post
PostSchema.methods.unlikePost = async function (userId: string) {
	try {
		await this.updateOne({ $pull: { likes: userId } })
	} catch (error) {
		console.log('Failed to unlike the post', error)
	}
}

//remove a post
PostSchema.methods.removePost = async function () {
	try {
		await this.model('Post').deleteOne({ _id: this.postId })
	} catch (error) {
		console.log('Failed to remove the post', error)
	}
}

//comment on a post
PostSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase) {
	try {
		const comment = await Comment.create(commentToAdd)
		this.comments.push(comment._id)
		await this.save()
	} catch (error) {
		console.log('Failed to comment on the post', error)
	}
}

//get all comments
PostSchema.methods.getAllComments = async function () {
	try {
		// const comments = await Comment.find({ _id: { $in: this.comments } })
		// return comments
		await this.populate({
			path: 'comments',
			options: { sort: { createdAt: -1 } } //sort comments by newest first
		})
		return this.comments
	} catch (error) {
		console.log('Failed to get all comments', error)
	}
}

//get all the post
PostSchema.statics.getAllPosts = async function () {
	try {
		const posts = await this.find()
			.sort({ createdAt: -1 })
			.populate({
				path: 'comments',
				options: { sort: { createdAt: -1 } }
			})
			.lean() //lean() converts mongoose object to plain JS object

		//convert all post and comment ids to string
		return posts.map((post: IPostDocument) => ({
			...post,
			_id: post._id.toString(),
			comments: post.comments?.map((comment: IComment) => ({
				...comment,
				_id: comment._id.toString()
			}))
		}))
	} catch (error) {
		console.log('Failed to get all posts', error)
	}
}

export const Post =
	(models.Post as IPostModel) ||
	mongoose.model<IPostDocument, IPostModel>('Post', PostSchema)
