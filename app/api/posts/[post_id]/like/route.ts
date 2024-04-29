import { connectDB } from '@/mongodb/db'
import { Post } from '@/mongodb/models/post'
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params }: { params: { post_id: string } }
) {
	await connectDB()

	try {
		const post = await Post.findById(params.post_id)

		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 })
		}

		// getting the number of likes
		const likes = await post.likes
		return NextResponse.json(likes, { status: 200 })
	} catch (error) {
		return NextResponse.json(
			{ error: 'An error occurred while fetching the likes' },
			{ status: 500 }
		)
	}
}

export interface LikePostRequestBody {
	userId: string
}

export async function POST(
	request: NextRequest,
	{ params }: { params: { post_id: string } }
) {
	auth().protect() // Only authorized people can delete a post
	const user = await currentUser() // Retrieving user details

	await connectDB()

	// const { userId }: LikePostRequestBody = await request.json()

	try {
		const post = await Post.findById(params.post_id)

		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 })
		}

		// await post.likePost(userId)
		await post.likePost(user!.id)

		return NextResponse.json({ message: 'Post liked successfully' })
	} catch (error) {
		return NextResponse.json(
			{ error: 'An error occurred while liking the post' },
			{ status: 500 }
		)
	}
}
