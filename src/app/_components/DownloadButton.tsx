"use client";

interface DownloadButtonProps {
  fileName?: string;
  filePath: string;
  buttonText?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}

// Simple download icon SVG
const DownloadIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export function DownloadButton({ 
  fileName = "resume.pdf",
  filePath,
  buttonText = "Download Resume",
  className = "",
  variant = "primary"
}: DownloadButtonProps) {
  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const baseClasses = "inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-lg hover:shadow-xl", 
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500 bg-transparent"
  };

  return (
    <button
      onClick={handleDownload}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={`Download ${fileName}`}
    >
      <DownloadIcon size={20} />
      {buttonText}
    </button>
  );
}