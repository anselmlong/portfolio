"use client"
import { useRouter } from 'next/navigation';


export function TopNav() {
	const router = useRouter();
	
	return (
		<nav className="flex items-center justify-between w-full p-4 text-xl font-bold border-b border-white/10">
			<div>Gallery</div>
			<header className="flex justify-end items-center p-4 gap-4 h-16">
				
			</header>
		</nav>
	)
}