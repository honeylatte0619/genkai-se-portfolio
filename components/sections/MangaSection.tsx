"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function MangaSection() {
    // Placeholder data
    const episodes = [1, 2, 3, 4];
    const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

    const openEpisode = (ep: number) => {
        setSelectedEpisode(ep);
    };

    const closeEpisode = () => {
        setSelectedEpisode(null);
    };

    const navigateEpisode = (direction: 'next' | 'prev') => {
        if (selectedEpisode === null) return;
        const index = episodes.indexOf(selectedEpisode);
        if (direction === 'next') {
            const nextEp = episodes[index + 1];
            if (nextEp) setSelectedEpisode(nextEp);
        } else {
            const prevEp = episodes[index - 1];
            if (prevEp) setSelectedEpisode(prevEp);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedEpisode === null) return;
            if (e.key === 'Escape') closeEpisode();
            if (e.key === 'ArrowRight') navigateEpisode('next');
            if (e.key === 'ArrowLeft') navigateEpisode('prev');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedEpisode]);


    return (
        <section id="manga" className="py-20 bg-background">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-mono mb-12">
                    <span className="text-accent">#</span> Manga Episodes
                </h2>

                {/* Latest Episode Highlight or Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {episodes.map((ep) => (
                        <div
                            key={ep}
                            className="aspect-[3/4] bg-slate-800 rounded-md border border-slate-700 overflow-hidden hover:border-accent transition-colors cursor-pointer group relative z-10"
                            onClick={() => openEpisode(ep)}
                        >
                            <img
                                src={`/images/0${ep}se.jpg`}
                                alt={`Episode ${ep}`}
                                className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-bold font-mono">Read Ep.{ep}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-8 border border-dashed border-slate-700 rounded-xl bg-slate-900/50">
                    <h3 className="text-2xl font-bold mb-4">Kindle版 配信中！</h3>
                    <p className="text-muted-foreground mb-6">
                        高解像度で読むならKindleがおすすめ。
                        <br />
                        特典イラストも収録！
                    </p>
                    <Button
                        size="lg"
                        className="bg-[#FF9900] hover:bg-[#FF9900]/90 text-white font-bold gap-2"
                        onClick={() => window.open('https://www.amazon.co.jp/dp/B0GDQLW5WZ', '_blank')}
                    >
                        <BookOpen className="h-5 w-5" />
                        Amazon Kindleで読む
                    </Button>
                </div>
            </div>

            {/* Manga Viewer Modal */}
            {selectedEpisode !== null && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                    <button
                        onClick={closeEpisode}
                        className="absolute top-4 right-4 text-white hover:text-accent p-2"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); navigateEpisode('prev'); }}
                        className={`absolute left-4 text-white p-2 ${episodes.indexOf(selectedEpisode) === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-accent'}`}
                        disabled={episodes.indexOf(selectedEpisode) === 0}
                    >
                        <ChevronLeft className="h-10 w-10 md:h-16 md:w-16" />
                    </button>

                    <div className="max-h-[90vh] max-w-4xl w-full h-full flex items-center justify-center">
                        <img
                            src={`/images/0${selectedEpisode}se.jpg`}
                            alt={`Episode ${selectedEpisode}`}
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); navigateEpisode('next'); }}
                        className={`absolute right-4 text-white p-2 ${episodes.indexOf(selectedEpisode) === episodes.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-accent'}`}
                        disabled={episodes.indexOf(selectedEpisode) === episodes.length - 1}
                    >
                        <ChevronRight className="h-10 w-10 md:h-16 md:w-16" />
                    </button>

                    <div className="absolute bottom-4 left-0 right-0 text-center text-white font-mono">
                        Ep.{selectedEpisode}
                    </div>
                </div>
            )}
        </section>
    );
}
