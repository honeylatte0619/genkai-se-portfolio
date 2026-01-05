"use client";

import { motion } from "framer-motion";
import { Gamepad2, Sword, Puzzle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GameSection() {
    return (
        <section id="games" className="py-20 relative overflow-hidden bg-slate-950">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-mono mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
                        {"<"} Mini Games {"/>"}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        息抜きに遊べるミニゲーム集。
                        ただし、納期には気をつけて...。
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Merge Puzzle */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-accent transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    >
                        <div className="p-8 flex flex-col items-center text-center h-full">
                            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Puzzle className="w-8 h-8 text-accent" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">限界マージパズル</h3>
                            <p className="text-sm text-slate-400 mb-6 flex-grow">
                                同じアイテムをくっつけて進化させよう！
                                画面がいっぱいになる前にスコアを稼げ！
                            </p>
                            <Button asChild className="w-full font-bold">
                                <Link href="/merge">Play Puzzle</Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* RPG */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-green-400 transition-all hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]"
                    >
                        <div className="p-8 flex flex-col items-center text-center h-full">
                            <div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Sword className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">無限残業RPG</h3>
                            <p className="text-sm text-slate-400 mb-6 flex-grow">
                                フルオートで進む放置系RPG。
                                資金を貯めてシャルロットを強化し、炎上案件を鎮火せよ！
                            </p>
                            <Button asChild className="w-full font-bold bg-green-600 hover:bg-green-700 text-white">
                                <Link href="/rpg">Play RPG</Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Clicker */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-400 transition-all hover:shadow-[0_0_20px_rgba(96,165,250,0.3)]"
                    >
                        <div className="p-8 flex flex-col items-center text-center h-full">
                            <div className="w-16 h-16 rounded-full bg-blue-400/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Gamepad2 className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Mugen Debug</h3>
                            <p className="text-sm text-slate-400 mb-6 flex-grow">
                                クリッカーゲームの決定版。
                                バグを潰して潰して潰しまくれ！
                            </p>
                            <Button asChild className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white">
                                <Link href="/game">Play Clicker</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
