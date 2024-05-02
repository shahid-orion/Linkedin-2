import { connectDB } from '@/mongodb/db'
import { Post } from '@/mongodb/models/post'
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
export async function GET(
	request: Request,
	{ params }: { params: { post_id: string } }
) {
	await connectDB()

	try {
		const post = await Post.findById(params.post_id)

		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 })
		}
		return NextResponse.json(post)
	} catch (error) {
		return NextResponse.json(
			{ error: 'An error occurred while fetching the post' },
			{ status: 404 }
		)
	}
}

// Delete post
//interface DeletePost
export interface DeletePostRequestBody {
	userId: string
}
export async function DELETE(
	request: Request,
	{ params }: { params: { post_id: string } }
) {
	auth().protect() // Only authorized people can delete a post
	// const user = await currentUser() // Retrieving user details

	await connectDB() // Then connect mongoDB

	const { userId }: DeletePostRequestBody = await request.json()

	try {
		const post = await Post.findById(params.post_id)
		// If there's no post found
		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 })
		}
		// If the delete request user is different from post user
		// if (post.user.userId !== user?.id) {
		if (post.user.userId !== userId) {
			return NextResponse.json(
				{ error: 'Unauthorized to delete the post' },
				{ status: 401 }
			)
		}

		await post.removePost()
		// await post.removePost(user!.id)
		return NextResponse.json({ message: 'Post deleted successfully' })
	} catch (error) {
		return NextResponse.json(
			{ error: 'An error occurred while deleting the post' },
			{ status: 404 }
		)
	}
}
