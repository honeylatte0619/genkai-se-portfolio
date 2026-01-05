import { Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-primary/20 bg-background py-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 font-mono">
                    © {new Date().getFullYear()} 限界SEアラサー女子の日常. All rights reserved.
                </p>
                <div className="flex items-center space-x-4">
                    <a
                        href="https://x.com/HNana81464"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary transition-colors"
                    >
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
