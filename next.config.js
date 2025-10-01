/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdwwp1j6bk.ufs.sh',
				port: '',
				pathname: '/f/**',
			},
			// Add other image hostnames if needed
		],
	},
	webpack: (config, { dev }) => {
		if (dev) {
			// Reduce cache serialization warnings in development
			config.cache = {
				...config.cache,
				maxMemoryGenerations: 1,
			};
		}
		return config;
	},
};

// Temporarily disable Sentry to debug router issues
// import { withSentryConfig } from "@sentry/nextjs";

export default config;
