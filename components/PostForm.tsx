'use client'

import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { ImageIcon, XIcon } from 'lucide-react'
import { ChangeEvent, useRef, useState } from 'react'
import createPostAction from '@/actions/createPostAction'

const PostForm = () => {
	const { user } = useUser()
	//to manipulate the form elements
	const ref = useRef<HTMLFormElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [preview, setPreview] = useState<string | null>(null)

	const handlePostAction = async (formData: FormData) => {
		const formDataCopy = formData // Copy the form data
		ref.current?.reset() // Reset the form after submission

		const text = formDataCopy.get('postInput') as string // Get the post input

		if (!text.trim()) {
			//if no text, throw an error
			throw new Error('Post text is required')
		}

		setPreview(null) // Reset the preview after submission

		try {
			await createPostAction(formDataCopy)
		} catch (error) {
			console.error('Error creating the post: ', error)
		}

		// Handle form submission with server action
		const response = await fetch('/api/posts', {
			method: 'POST',
			body: formData
		})

		if (response.ok) {
			// Toast notification based on the promise above
			console.log('Post created successfully')
		}
	}

	const imageChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]

		if (file) {
			const reader = new FileReader()
			// reader.onloadend = () => {
			// 	setPreview(reader.result as string)
			// }
			// reader.readAsDataURL(file)
			setPreview(URL.createObjectURL(file))
		}
	}

	return (
		<div className="mb-2">
			<form
				ref={ref}
				action={(formData) => {
					// Handle form submission with server action
					handlePostAction(formData)
					// Toast notification based on the promise above
				}}
				className="p-3 bg-white rounded-lg border"
			>
				<div className="flex items-center space-x-2">
					<Avatar>
						{user?.id ? (
							<>
								<AvatarImage src={user?.imageUrl} />

								<AvatarFallback>
									{user?.firstName?.charAt(0)}
									{user?.lastName?.charAt(0)}
								</AvatarFallback>
							</>
						) : (
							<AvatarImage src={'https://github.com/shadcn.png'} />
						)}
					</Avatar>
					<input
						type="text"
						name="postInput"
						placeholder="Start writing a post..."
						className="flex-1 outline-none rounded-full py-3 px-4 border"
					/>
					<input
						ref={fileInputRef}
						type="file"
						name="image"
						accept="image/*"
						hidden
						onChange={imageChangeHandler}
					/>
					<button type="submit" hidden>
						Post
					</button>
				</div>
				{/* preview conditional check */}
				{preview && (
					<div className="mt-3">
						<img src={preview} alt="Preview" className="w-full object-cover" />
					</div>
				)}

				<div className="flex justify-end mt-2 space-x-2">
					<Button type="button" onClick={() => fileInputRef.current?.click()}>
						<ImageIcon className="mr-2" size={16} color="currentcolor" />
						{preview ? 'Change' : 'Add'} image
					</Button>

					{/* Add a remove preview button */}
					{preview && (
						<Button
							variant="outline"
							type="button"
							onClick={() => setPreview(null)}
						>
							<XIcon className="mr-2" size={16} color="currentColor" />
							Remove image
						</Button>
					)}
				</div>
			</form>

			<hr className="mt-2 border-gray-200" />
		</div>
	)
}

export default PostForm
