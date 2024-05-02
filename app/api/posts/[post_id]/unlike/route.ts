import { connectDB } from '@/mongodb/db'
import { Post } from '@/mongodb/models/post'
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export interface UnlikePostRequestBody {
	userId: string
}

export async function POST(
	request: Request,
	{ params }: { params: { post_id: string } }
) {
	auth().protect() // Only authorized people can delete a post
	// const user = await currentUser() // Retrieving user details

	await connectDB()

	const { userId }: UnlikePostRequestBody = await request.json()

	try {
		const post = await Post.findById(params.post_id)

		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 })
		}

		await post.unlikePost(userId)
		// await post.unlikePost(user!.id)

		return NextResponse.json({ message: 'Post unlike successfully' })
	} catch (error) {
		return NextResponse.json(
			{ error: 'An error occurred while liking the post' },
			{ status: 500 }
		)
	}
}
