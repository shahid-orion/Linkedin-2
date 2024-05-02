import { connectDB } from '@/mongodb/db'
import { IPostBase, Post } from '@/mongodb/models/post'
import { IUser } from '@/types/user'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

//interface
export interface AddPostRequestBody {
	user: IUser
	text: string
	imageUrl?: string | null
}
export async function POST(req: NextRequest, res: NextResponse) {
	//to protect this route with authentication
	// auth().protect()

	const { user, text, imageUrl }: AddPostRequestBody = await req.json()
	try {
		await connectDB() //connecting to mongodb server

		const postData: IPostBase = { user, text, ...(imageUrl && { imageUrl }) }

		const post = await Post.create(postData)

		return NextResponse.json({ message: 'Post created successfully', post })
	} catch (error) {
		return NextResponse.json(
			{ error: `An error occurred while creating the post ${{ error }}` },
			{ status: 500 }
		)
	}
}

export async function GET(req: NextRequest, res: NextResponse) {
	//to protect this route with authentication
	// auth().protect()
	try {
		await connectDB() //connecting to mongodb server

		const posts = await Post.getAllPosts()

		return NextResponse.json(posts)
	} catch (error) {
		return NextResponse.json(
			{ error: 'An error occurred while fetching posts' },
			{ status: 500 }
		)
	}
}
