import { Button } from "@/components/ui/button";
import { ShoppingBag, Sticker } from "lucide-react";

export default function GoodsSection() {
    return (
        <section id="goods" className="py-20 bg-slate-900/50">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-mono mb-12">
                    <span className="text-secondary">$</span> Official Goods
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* LINE Stamp */}
                    <div className="p-8 rounded-xl bg-[#06C755]/10 border border-[#06C755]/30 hover:bg-[#06C755]/20 transition-colors">
                        <div className="h-24 w-auto mx-auto mb-4 flex justify-center">
                            <img src="/images/Line.png" alt="LINE" className="h-full object-contain" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">LINE Stamps</h3>
                        <p className="text-sm text-gray-400 mb-6">
                            "LGTM", "Review please" etc. <br /> Works well for engineers.
                        </p>
                        <a href="https://store.line.me/stickershop/author/5851573/ja" target="_blank" rel="noopener noreferrer">
                            <Button className="bg-[#06C755] hover:bg-[#06C755]/90 w-full font-bold">
                                STORE
                            </Button>
                        </a>
                    </div>

                    {/* SUZURI */}
                    <div className="p-8 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-500 transition-colors">
                        <div className="h-24 w-auto mx-auto mb-4 flex justify-center">
                            <img src="/images/suzuri.jpg" alt="SUZURI" className="h-full object-contain rounded-full" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">SUZURI Store</h3>
                        <p className="text-sm text-gray-400 mb-6">
                            T-shirts, Mugs, Sparkers. <br /> Daily use items.
                        </p>
                        <a href="https://suzuri.jp/honeylatte0619" target="_blank" rel="noopener noreferrer">
                            <Button variant="secondary" className="w-full font-bold">
                                Check Items
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
