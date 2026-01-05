import { Button } from "@/components/ui/button";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Background Grid & Particles (CSS only for simplicity) */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
                <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-secondary/20 opacity-20 blur-[100px]"></div>
            </div>

            <div className="container relative z-10 px-4 text-center">
                <div className="inline-block mb-4 px-3 py-1 bg-primary/10 border border-primary/50 rounded-full">
                    <span className="text-primary text-sm font-mono animate-pulse">
                        System Status: CRITICAL (Caffeine Low)
                    </span>
                </div>

                <div className="mb-8 relative w-full max-w-lg mx-auto aspect-video rounded-xl overflow-hidden shadow-[0_0_50px_theme('colors.primary.DEFAULT')] border-2 border-primary/50">
                    <img src="/images/segenkai.jpg" alt="限界SEアラサー女子" className="object-cover w-full h-full" />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold font-mono tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary animate-in fade-in slide-in-from-bottom-5 duration-1000 drop-shadow-lg">
                    限界SE
                    <br />
                    アラサー女子
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    バグとラテに支配された日常。
                    <br />
                    <span className="text-sm md:text-base opacity-75 font-mono">
                        {">"} git commit -m "Fix logic, add features, sleep less"
                    </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="neon" size="lg" className="font-bold text-lg">
                        最新話を読む
                    </Button>
                    <Button variant="outline" size="lg" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                        キャラクター紹介
                    </Button>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-primary/50">
                ▼ Scroll Down ▼
            </div>
        </section>
    );
}
