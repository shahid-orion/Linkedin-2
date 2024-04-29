import { linkein96 } from '@/assets'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import {
	BellIcon,
	Briefcase,
	HomeIcon,
	MessagesSquare,
	SearchIcon,
	UsersIcon
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

type Props = {}

const Header = (props: Props) => {
	return (
		<div className="flex items-center p-2 max-w-6xl mx-auto">
			<Image
				className="rounded-lg"
				// src={linkein96}
				src="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg"
				width={40}
				height={40}
				alt="linkedin"
			/>

			{/* search form container */}
			<div className="flex-1">
				<form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
					<SearchIcon className="h-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search..."
						className="bg-transparent rounded flex-1 outline-none"
					/>
				</form>
			</div>
			{/* Icons container */}
			<div className="flex items-center space-x-4 px-6">
				<Link href="/" className="icon">
					<HomeIcon className="h-5" />
					<p>Home</p>
				</Link>
				<Link href="/" className="icon hidden md:flex">
					<UsersIcon className="h-5" />
					<p>Network</p>
				</Link>
				<Link href="/" className="icon hidden md:flex">
					<Briefcase className="h-5" />
					<p>Jobs</p>
				</Link>
				<Link href="/" className="icon">
					<MessagesSquare className="h-5" />
					<p>Messaging</p>
				</Link>
				{/* <Link href="/" className="icon">
					<BellIcon className="h-5" />
					<p>Notification</p>
				</Link> */}

				{/* clerk user button if signed in*/}
				<SignedIn>
					<UserButton />
				</SignedIn>

				{/* clerk sign-in button if NOT signed in*/}
				<SignedOut>
					<Button asChild>
						<SignInButton />
					</Button>
				</SignedOut>
			</div>
		</div>
	)
}

export default Header
