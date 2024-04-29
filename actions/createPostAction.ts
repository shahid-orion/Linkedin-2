'use server'

import { AddPostRequestBody } from '@/app/api/posts/route'
import { Post } from '@/mongodb/models/post'
import { IUser } from '@/types/user'
import { auth, currentUser } from '@clerk/nextjs/server'

export default async function createPostAction(formData: FormData) {
	//Clerk authentication
	const user = await currentUser()
	if (!user) {
		throw new Error('User not authenticated')
	}

	//auth().protect() //protect the route

	// Get the post input and image from the form data
	const postInput = formData.get('postInput') as string
	const image = formData.get('image') as File
	let imageUrl: string | undefined

	if (!postInput.trim()) {
		throw new Error('Please, Post text is required')
	}

	//define user --> IUser
	const userDB: IUser = {
		userId: user.id,
		userImage: user.imageUrl,
		firstName: user.firstName || '',
		lastName: user.lastName || ''
	}

	try {
		//upload image if there is one
		if (image.size > 0) {
			// 1. upload image if there is one -- MS blob storage
			// 2. create post in database with image
			const body: AddPostRequestBody = {
				user: userDB,
				text: postInput,
				imageUrl: imageUrl
			}
			// await Post.create(body)
		} else {
			// 1. create post in database without image
			const body: AddPostRequestBody = {
				user: userDB,
				text: postInput
			}

			await Post.create(body)
		}
	} catch (error: any) {
		throw new Error('Error creating post with image', error)
	}

	//create post

	//revalidate home page '/'

	const response = await fetch('/api/posts', {
		method: 'POST',
		body: formData
	})

	if (!response.ok) {
		throw new Error('Error creating the post')
	}

	return response.json()
}
