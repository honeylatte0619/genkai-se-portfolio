import Link from "next/link";
import { Menu, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 text-primary hover:text-accent transition-colors">
                    <Terminal className="h-6 w-6" />
                    <span className="font-bold text-xl font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                        限界SEアラサー女子
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
                    <Link href="#manga" className="hover:text-primary transition-colors">Manga</Link>
                    <Link href="#goods" className="hover:text-primary transition-colors">Goods</Link>
                    <Link href="/game" className="text-secondary hover:text-accent transition-colors font-bold">
                        Game_Start()
                    </Link>
                </nav>

                {/* Mobile Nav Toggle (Placeholder for now) */}
                <button className="md:hidden text-primary">
                    <Menu className="h-6 w-6" />
                </button>
            </div>
        </header>
    );
}
