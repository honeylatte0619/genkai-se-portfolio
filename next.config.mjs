/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/isekai-status-maker/:path*',
                destination: '/isekai-status-maker/index.html',
            },
        ];
    },
};

export default nextConfig;
