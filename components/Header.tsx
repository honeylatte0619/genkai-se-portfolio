"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 text-primary hover:text-accent transition-colors" onClick={() => setIsOpen(false)}>
                    <Terminal className="h-6 w-6" />
                    <span className="font-bold text-xl font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                        限界SEアラサー女子
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
                    <Link href="/#manga" className="hover:text-primary transition-colors">Manga</Link>
                    <Link href="/#goods" className="hover:text-primary transition-colors">Goods</Link>
                    <Link href="/merge" className="hover:text-primary transition-colors font-bold text-accent">Puzzle</Link>
                    <Link href="/rpg" className="hover:text-primary transition-colors font-bold text-green-400">RPG</Link>
                    <Link href="/game" className="text-secondary hover:text-accent transition-colors font-bold">
                        Game_Start()
                    </Link>
                    <Link href="/isekai-status-maker/index.html" className="text-cyan-400 hover:text-cyan-200 transition-colors font-bold flex items-center gap-1">
                        <span className="animate-pulse">✨</span>Status_Maker
                    </Link>
                    <Link href="/isekai-status-maker/novel-promo" className="text-pink-400 hover:text-pink-200 transition-colors font-bold flex items-center gap-1">
                        🎬Promo_Maker
                    </Link>
                </nav>

                {/* Mobile Nav Toggle */}
                <button className="md:hidden text-primary p-2" onClick={() => setIsOpen(!isOpen)}>
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-primary/20 p-4 flex flex-col space-y-4 shadow-2xl animate-in slide-in-from-top-5">
                    <Link href="/#manga" className="p-2 hover:bg-white/5 rounded text-foreground font-medium" onClick={() => setIsOpen(false)}>Manga</Link>
                    <Link href="/#goods" className="p-2 hover:bg-white/5 rounded text-foreground font-medium" onClick={() => setIsOpen(false)}>Goods</Link>
                    <Link href="/merge" className="p-2 hover:bg-white/5 rounded text-accent font-bold" onClick={() => setIsOpen(false)}>Puzzle Game</Link>
                    <Link href="/rpg" className="p-2 hover:bg-white/5 rounded text-green-400 font-bold" onClick={() => setIsOpen(false)}>Idle Text RPG</Link>
                    <Link href="/game" className="p-2 hover:bg-white/5 rounded text-secondary font-bold" onClick={() => setIsOpen(false)}>Clicker Game</Link>
                    <Link href="/isekai-status-maker/index.html" className="p-2 hover:bg-white/5 rounded text-cyan-400 font-bold" onClick={() => setIsOpen(false)}>Status Maker</Link>
                    <Link href="/isekai-status-maker/novel-promo" className="p-2 hover:bg-white/5 rounded text-pink-400 font-bold" onClick={() => setIsOpen(false)}>Novel Promo Maker</Link>
                </div>
            )}
        </header>
    );
}
