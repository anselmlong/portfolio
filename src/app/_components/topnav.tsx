"use client"
import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from '@clerk/nextjs'
import { useRouter } from 'next/navigation';
import { UploadButton } from '~/utils/uploadthing'


export function TopNav() {
	const router = useRouter();
	
	return (
		<nav className="flex items-center justify-between w-full p-4 text-xl font-bold border-b border-white/10">
			<div>Gallery</div>
			<header className="flex justify-end items-center p-4 gap-4 h-16">
				<SignedOut>
					<SignInButton />
				</SignedOut>
				<SignedIn>
					<UploadButton
						endpoint="imageUploader"
						onClientUploadComplete={(res) => {
							// Do something with the response
							console.log("Files: ", res);
							router.refresh();	
						}}
						onUploadError={(error: Error) => {
							// Do something with the error.
							alert(`ERROR! ${error.message}`);
						}}
					/>
					<UserButton />
				</SignedIn>
			</header>
		</nav>
	)
}