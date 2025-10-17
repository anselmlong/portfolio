"use client"
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DownloadButton } from './DownloadButton';

export function TopNav() {
	const router = useRouter();
	// Secret 5-click easter egg on logo within 3 seconds
	const clickCountRef = useRef(0);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const handleSecretClick = () => {
		clickCountRef.current += 1;
		if (clickCountRef.current === 1) {
			// Start/reset 3s window on first click
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => {
				clickCountRef.current = 0;
				timeoutRef.current = null;
			}, 3000);
		}
		if (clickCountRef.current >= 5) {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			clickCountRef.current = 0;
			timeoutRef.current = null;
			router.push('/xuan');
		}
	};

	return (
		<nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
			<div className="container mx-auto px-4">
				<header className="flex justify-between items-center py-4">
					<div className="flex items-center gap-8">
						<h1 onClick={handleSecretClick} className="cursor-pointer select-none text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
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