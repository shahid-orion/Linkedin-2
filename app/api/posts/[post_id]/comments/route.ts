import { connectDB } from '@/mongodb/db'
import { Post } from '@/mongodb/models/post'
import { ICommentBase } from '@/types/comment'
import { IUser } from '@/types/user'
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: { post_id: string } }
) {
	auth().protect() // Only authorized people can delete a post
	await connectDB()

	try {
		const post = await Post.findById(params.post_id)

		if (!post) {
			return NextResponse.json({ error: 'Post comment found' }, { status: 404 })
		}

		// getting the number of comments
		const comments = await post.getAllComments()
		return NextResponse.json(comments)
	} catch (error) {
		return NextResponse.json(
			{ error: 'An error occurred while fetching the comments' },
			{ status: 500 }
		)
	}
}

export interface AddCommentRequestBody {
	user: IUser
	text: string
}

export async function POST(
	request: Request,
	{ params }: { params: { post_id: string } }
) {
	auth().protect() // Only authorized people can delete a post
	// const user = await currentUser() // Retrieving user details

	await connectDB()

	const { user, text }: AddCommentRequestBody = await request.json()

	try {
		const post = await Post.findById(params.post_id)

		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 })
		}

		const comment: ICommentBase = {
			user,
			text
		}

		await post.commentOnPost(comment)

		return NextResponse.json({ message: 'Comment added successfully' })
	} catch (error) {
		return NextResponse.json(
			{ error: 'An error occurred while adding comment' },
			{ status: 500 }
		)
	}
}
