"use client";

import { useClickerGame } from "@/hooks/useClickerGame";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Bug, Zap, Coffee, Heart, Bot } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function GamePage() {
    const { money, items, buyItem, clickBug, totalCps, loaded } = useClickerGame();
    const [clicks, setClicks] = useState<{ id: number, x: number, y: number, text: string }[]>([]);

    // Prevent hydration mismatch by waiting for load
    if (!loaded) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

    const handleBugClick = (e: React.MouseEvent) => {
        const amount = clickBug();

        // Add floating text
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newClick = {
            id: Date.now(),
            x,
            y,
            text: ["Fix!", "Fixed!", "Resolved!", "LGTM!"][Math.floor(Math.random() * 4)]
        };

        setClicks(prev => [...prev, newClick]);

        // Cleanup Effect (simple timeout)
        setTimeout(() => {
            setClicks(prev => prev.filter(c => c.id !== newClick.id));
        }, 1000);
    };

    const getIcon = (id: string) => {
        switch (id) {
            case 'coffee': return <Coffee className="w-5 h-5 text-amber-500" />;
            case 'sister': return <Heart className="w-5 h-5 text-pink-500" />;
            case 'ai': return <Bot className="w-5 h-5 text-cyan-500" />;
            default: return <Zap className="w-5 h-5" />;
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />

            <div className="flex-1 container mx-auto px-4 pt-24 pb-12 flex flex-col md:flex-row gap-8">

                {/* Left: Clicker Zone */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] border border-primary/20 rounded-2xl bg-slate-900/50 relative overflow-hidden">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-mono font-bold text-primary mb-2">
                            ¥ {money.toLocaleString()}
                        </h1>
                        <p className="text-muted-foreground mono">
                            Current Income: ¥{totalCps.toLocaleString()}/sec
                        </p>
                    </div>

                    <button
                        onClick={handleBugClick}
                        className="group relative p-8 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 transition-all active:scale-95 duration-75"
                    >
                        <Bug className="w-32 h-32 text-red-500 animate-pulse group-hover:animate-none" />
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 text-red-300 font-bold tracking-wider">
                            CLICK TO FIX!
                        </span>

                        {/* Click Effects */}
                        {clicks.map(click => (
                            <span
                                key={click.id}
                                className="absolute text-xl font-bold text-green-400 pointer-events-none animate-out fade-out slide-out-to-top-10 duration-700"
                                style={{ left: click.x, top: click.y }}
                            >
                                {click.text}
                            </span>
                        ))}
                    </button>

                    <p className="mt-8 text-sm text-gray-500">
                        バグをクリックして修正してください
                    </p>
                </div>

                {/* Right: Shop Zone */}
                <div className="w-full md:w-96 flex flex-col gap-4">
                    <div className="bg-slate-900/80 border border-secondary/20 p-6 rounded-xl h-full">
                        <h2 className="text-2xl font-bold font-mono mb-6 flex items-center gap-2">
                            <Zap className="text-secondary" />
                            SHOP
                        </h2>

                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="p-4 rounded-lg bg-black/40 border border-white/10 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800 rounded-md">
                                                {getIcon(item.id)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{item.name}</h3>
                                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xl font-mono text-secondary">x{item.count}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-green-400">+{item.cps} 円/秒</span>
                                        <Button
                                            size="sm"
                                            disabled={money < item.price}
                                            onClick={() => buyItem(item.id)}
                                            className={cn(
                                                money >= item.price ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "opacity-50"
                                            )}
                                        >
                                            ¥ {item.price.toLocaleString()}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
