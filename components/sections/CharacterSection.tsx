"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function CharacterSection() {
    const characters = [
        {
            name: "双葉 (Futaba)",
            role: "Backend Engineer",
            desc: "長女。責任感が強いが、深夜テンションで変なコードを書く。",
            color: "border-primary text-primary",
            image: "/images/sefutaba.png",
        },
        {
            name: "華 (Hana)",
            role: "Frontend Engineer",
            desc: "次女。流行りの技術とおしゃれが好き。CSSと和解できない。",
            color: "border-accent text-accent",
            image: "/images/sehana.png",
        },
        {
            name: "実 (Minori)",
            role: "Infrastructure / AI",
            desc: "三女。実はガジェット大好きで、新しいデバイスを見ると目が輝く純真無垢な性格。",
            color: "border-secondary text-secondary",
            image: "/images/seminori.png",
        },
    ];

    const [selectedCharacterIndex, setSelectedCharacterIndex] = useState<number | null>(null);

    const openCharacter = (index: number) => {
        setSelectedCharacterIndex(index);
    };

    const closeCharacter = () => {
        setSelectedCharacterIndex(null);
    };

    const navigateCharacter = (direction: 'next' | 'prev') => {
        if (selectedCharacterIndex === null) return;

        if (direction === 'next') {
            const nextIndex = selectedCharacterIndex + 1;
            if (nextIndex < characters.length) setSelectedCharacterIndex(nextIndex);
        } else {
            const prevIndex = selectedCharacterIndex - 1;
            if (prevIndex >= 0) setSelectedCharacterIndex(prevIndex);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedCharacterIndex === null) return;
            if (e.key === 'Escape') closeCharacter();
            if (e.key === 'ArrowRight') navigateCharacter('next');
            if (e.key === 'ArrowLeft') navigateCharacter('prev');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedCharacterIndex]);

    return (
        <section id="character" className="py-20 bg-black/20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold font-mono text-center mb-12">
                    <span className="text-primary">{"<"}</span> Characters <span className="text-primary">{"/>"}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {characters.map((char, index) => (
                        <div
                            key={index}
                            className={`group relative p-6 border ${char.color} bg-background/50 backdrop-blur rounded-xl hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-1 cursor-pointer z-10`}
                            onClick={() => openCharacter(index)}
                        >
                            <div className="h-48 w-full bg-slate-800 rounded-lg mb-4 overflow-hidden relative">
                                <img
                                    src={char.image}
                                    alt={char.name}
                                    className="object-cover w-full h-full hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <h3 className={`text-xl font-bold mb-1 ${char.color.split(' ')[1]}`}>{char.name}</h3>
                            <p className="text-xs font-mono text-muted-foreground mb-3">{char.role}</p>
                            <p className="text-sm leading-relaxed">
                                {char.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Character Viewer Modal */}
            {selectedCharacterIndex !== null && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
                    <button
                        onClick={(e) => { e.stopPropagation(); closeCharacter(); }}
                        className="absolute top-4 right-4 text-white hover:text-primary p-2 z-50"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); navigateCharacter('prev'); }}
                        className={`absolute left-4 z-50 text-white p-2 ${selectedCharacterIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-primary'}`}
                        disabled={selectedCharacterIndex === 0}
                    >
                        <ChevronLeft className="h-10 w-10 md:h-16 md:w-16" />
                    </button>

                    <div className="max-h-[90vh] max-w-4xl w-full h-full flex items-center justify-center relative">
                        <img
                            src={characters[selectedCharacterIndex].image}
                            alt={characters[selectedCharacterIndex].name}
                            className="max-h-full max-w-full object-contain"
                        />
                        <div className="absolute bottom-0 text-white bg-black/50 px-4 py-2 rounded-full font-bold">
                            {characters[selectedCharacterIndex].name}
                        </div>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); navigateCharacter('next'); }}
                        className={`absolute right-4 z-50 text-white p-2 ${selectedCharacterIndex === characters.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-primary'}`}
                        disabled={selectedCharacterIndex === characters.length - 1}
                    >
                        <ChevronRight className="h-10 w-10 md:h-16 md:w-16" />
                    </button>
                </div>
            )}
        </section>
    );
}
