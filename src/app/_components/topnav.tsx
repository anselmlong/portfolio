"use client"
import { useRouter } from 'next/navigation';
import { DownloadButton } from './DownloadButton';

export function TopNav() {
	const router = useRouter();

	return (
		<nav className="flex items-center justify-between w-full p-4 text-xl font-bold border-b border-white/10">
			<header className="flex flex-auto justify-between items-center p-4 gap-4 h-16">
				<h1 className='mx-auto p-4'>Anselm Long</h1>
				<div className="flex gap-3 p-3">
					<DownloadButton
						filePath="/resume.pdf"
						fileName="Anselm_Long_Resume.pdf"
						buttonText="Resume"
						variant="primary"
					/>
				</div>
			</header>
		</nav>
	)
}