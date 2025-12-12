"use client"
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function TopNav() {
	const router = useRouter();
	// Secret 5-click easter egg on logo within 3 seconds
	const clickCountRef = useRef(0);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const fileName = "Anselm_Long_Resume.pdf",
		filePath = "/resume.pdf";
	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);


	// Optional programmatic download (not needed when using anchor with download)
	const handleDownload = () => {
		const link = document.createElement('a');
		link.href = filePath;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
			<div className="container mx-auto px-0">
				<header className="flex justify-between items-center py-4">
					<div className="flex items-center gap-8">
						<a href="/"  className="cursor-pointer select-none text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent hover:from-gray-100 hover:to-gray-300 transition-all">
							AL
						</a>
						<nav className="flex flex-row md:flex-row gap-4 md:gap-6 md:mt-0">
							<a href="/blog" className="text-gray-300 hover:text-white transition-colors">
								blog
							</a>
							{/*
							<a href="/photos" className="text-gray-300 hover:text-white transition-colors">
								photos
							</a>
							*/}
							<a
								href={filePath}
								download={fileName}
								className="group text-gray-300 hover:text-gray-100 transition-all duration-300 transform hover:scale-110"
								aria-label={`Download ${fileName}`}
							>
								resume
							</a>
						</nav>
					</div>

					<div className="flex items-center ">
						<div className="flex gap-2 md:gap-6 justify-center items-center">
							<a
								href="mailto:anselmpius@gmail.com"
								className="group text-gray-300 hover:text-gray-100 transition-all duration-300 transform hover:scale-110"
								aria-label="Email"
							>
								<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
									<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
								</svg>
							</a>
							<a
								href="https://linkedin.com/in/anselmlong"
								target="_blank"
								rel="noopener noreferrer"
								className="group text-gray-300 hover:text-gray-100 transition-all duration-300 transform hover:scale-110"
								aria-label="LinkedIn"
							>
								<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
									<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
								</svg>
							</a>
							<a
								href="https://github.com/anselmlong"
								target="_blank"
								rel="noopener noreferrer"
								className="group text-gray-300 hover:text-gray-100 transition-all duration-300 transform hover:scale-110"
								aria-label="GitHub"
							>
								<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
								</svg>
							</a>

						</div>
					</div>
				</header>
			</div>
		</nav>
	)
}