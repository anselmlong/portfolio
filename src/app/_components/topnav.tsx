"use client"
import { useRouter } from 'next/navigation';
import { DownloadButton } from './DownloadButton';

export function TopNav() {
	const router = useRouter();

	return (
		<nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
			<div className="container mx-auto px-4">
				<header className="flex justify-between items-center py-4">
					<div className="flex items-center gap-8">
						<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
							AL
						</h1>
						<nav className="hidden md:flex gap-6">
							<a href="#projects" className="text-gray-300 hover:text-white transition-colors">
								Projects
							</a>
							<a href="#experience" className="text-gray-300 hover:text-white transition-colors">
								Experience
							</a>
							<a href="#gallery" className="text-gray-300 hover:text-white transition-colors">
								Gallery
							</a>
						</nav>
					</div>
					
					<div className="flex items-center gap-4">
						<DownloadButton
							filePath="/resume.pdf"
							fileName="Anselm_Long_Resume.pdf"
							buttonText="Resume"
							variant="primary"
						/>
					</div>
				</header>
			</div>
		</nav>
	)
}