import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import CharacterSection from "@/components/sections/CharacterSection";
import MangaSection from "@/components/sections/MangaSection";
import GameSection from "@/components/sections/GameSection";
import GoodsSection from "@/components/sections/GoodsSection";

export default function Home() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
            <Header />
            <Hero />
            <CharacterSection />
            <GameSection />
            <MangaSection />
            <GoodsSection />
            <Footer />
        </main>
    );
}
