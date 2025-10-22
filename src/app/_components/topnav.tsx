"use client"
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DownloadButton } from './DownloadButton';

export function TopNav() {
	const router = useRouter();
	// Secret 5-click easter egg on logo within 3 seconds
	const clickCountRef = useRef(0);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const fileName = "resume.pdf",
		filePath = "/resume.pdf",
		variant = "primary";
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
	const handleDownload = () => {
		// Create a temporary link element
		const link = document.createElement('a');
		link.href = filePath;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
			<div className="container mx-auto px-4">
				<header className="flex justify-between items-center py-4">
					<div className="flex items-center gap-8">
						<h1 onClick={handleSecretClick} className="cursor-pointer select-none text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
							AL
						</h1>
						<nav className="hidden md:flex gap-6">
							<a href="/blog" className="text-gray-300 hover:text-white transition-colors">
								blog
							</a>
							<a href="/photos-gallery" className="text-gray-300 hover:text-white transition-colors">
								photos
							</a>
						</nav>
					</div>

					<div className="flex items-center ">
						<div className="flex gap-6 justify-center items-center">
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
							<a
								onClick={handleDownload}
								className="group text-gray-300 hover:text-gray-100 transition-all duration-300 transform hover:scale-110"
								aria-label={`Download ${fileName}`}
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
									<path d="m55.707 11.293-10-10A1.115 1.115 0 0 0 45 1H9a1 1 0 0 0-1 1v60a1 1 0 0 0 1 1h46a1 1 0 0 0 1-1V12a1.092 1.092 0 0 0-.293-.707zM52.586 11H46V4.414zM10 61V3h34v9a1 1 0 0 0 1 1h9v48z" style={{ fill: "#28282b" }} />
									<path d="M34 8h7a1 1 0 0 0 0-2h-7a1 1 0 0 0 0 2zM34 13h7a1 1 0 0 0 0-2h-7a1 1 0 0 0 0 2zM50 16H34a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2zM50 21H34a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2zM50 26H34a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2zM50 31H14a1 1 0 0 0 0 2h36a1 1 0 0 0 0-2zM50 36H14a1 1 0 0 0 0 2h36a1 1 0 0 0 0-2zM50 41H14a1 1 0 0 0 0 2h36a1 1 0 0 0 0-2zM50 46H14a1 1 0 0 0 0 2h36a1 1 0 0 0 0-2zM50 51H14a1 1 0 0 0 0 2h36a1 1 0 0 0 0-2zM50 56H14a1 1 0 0 0 0 2h36a1 1 0 0 0 0-2zM22 19a5 5 0 1 0-5-5 5.006 5.006 0 0 0 5 5zm0-8a3 3 0 1 1-3 3 3 3 0 0 1 3-3z" style={{ fill: "#28282b" }} /><path d="M14 28h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H14a1 1 0 0 0-1 1v20a1 1 0 0 0 1 1zm1.473-2a7.325 7.325 0 0 1 13.054 0zM29 8v15.164a9.325 9.325 0 0 0-14 0V8z" style={{ fill: "#28282b" }} />
								</svg>
							</a>
						</div>
					</div>
				</header>
			</div>
		</nav>
	)
}