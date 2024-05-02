/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'upload.wikimedia.org'
			},
			{
				protocol: 'https',
				hostname: 'img.clerk.com'
			},
			{
				protocol: 'https',
				hostname: 'linkedinclone.blob.core.windows.net'
			}
		]
	}
}

export default nextConfig
