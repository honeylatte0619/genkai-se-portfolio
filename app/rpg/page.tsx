"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Coffee, Book, Monitor, Play, RotateCcw } from "lucide-react";

// --- Game Constants & Interfaces ---
interface Player {
    level: number;
    hp: number;
    maxHp: number;
    attack: number;
    exp: number;
    nextExp: number;
    money: number;
    attackInterval: number; // ms
}

interface Enemy {
    name: string;
    maxHp: number;
    hp: number;
    attack: number;
    expReward: number;
    moneyReward: number;
}

interface Log {
    id: number;
    message: string;
    type: "player" | "enemy" | "system" | "reward";
}

const INITIAL_PLAYER: Player = {
    level: 1,
    hp: 100,
    maxHp: 100,
    attack: 10,
    exp: 0,
    nextExp: 100,
    money: 0,
    attackInterval: 1000,
};

const JOB_NAMES = [
    "タイポ",
    "ヌルポ",
    "無限ループ",
    "仕様変更",
    "緊急メンテ",
    "納期",
    "スパゲッティコード",
    "ゾンビプロセス",
    "メモリリーク",
    "炎上案件",
];

// --- Helper Functions ---
const generateEnemy = (stage: number): Enemy => {
    const jobIndex = Math.min((stage - 1) % JOB_NAMES.length, JOB_NAMES.length - 1);
    const baseHp = 50 + stage * 20;
    const baseAtk = 5 + stage * 2;

    return {
        name: `${JOB_NAMES[jobIndex]} (Lv.${stage})`,
        maxHp: baseHp,
        hp: baseHp,
        attack: baseAtk,
        expReward: 20 + stage * 10,
        moneyReward: 10 + stage * 5,
    };
};

const UPGRADE_COSTS = {
    attack: (level: number) => Math.floor(100 * Math.pow(1.5, level)),
    exp: (level: number) => Math.floor(200 * Math.pow(1.5, level)),
    speed: (level: number) => Math.floor(500 * Math.pow(2.0, level)),
};

export default function RPGPage() {
    // --- State ---
    const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
    const [stage, setStage] = useState(1);
    const [enemy, setEnemy] = useState<Enemy>(generateEnemy(1));
    const [logs, setLogs] = useState<Log[]>([]);
    const [autoBattle, setAutoBattle] = useState(false);

    // Upgrade Levels (for cost calc)
    const [upgrades, setUpgrades] = useState({ attack: 0, exp: 0, speed: 0 });

    const logCounter = useRef(0);
    const logsEndRef = useRef<HTMLDivElement>(null);
    const attackTimerRef = useRef<NodeJS.Timeout | null>(null);

    // --- Persistence ---
    useEffect(() => {
        const saved = localStorage.getItem("rpg_save_data_v1");
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setPlayer(data.player);
                setStage(data.stage);
                setUpgrades(data.upgrades || { attack: 0, exp: 0, speed: 0 });
                addLog("セーブデータをロードしました。", "system");
            } catch (e) {
                console.error("Failed to load save", e);
            }
        } else {
            addLog("社畜騎士シャルロットの無限残業が始まった...", "system");
        }
    }, []);

    useEffect(() => {
        if (player.level > 1 || player.money > 0) {
            const data = { player, stage, upgrades };
            localStorage.setItem("rpg_save_data_v1", JSON.stringify(data));
        }
    }, [player, stage, upgrades]);

    // --- Auto Scroll Logs ---
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    // --- Battle Logic ---
    const addLog = (message: string, type: Log["type"]) => {
        logCounter.current += 1;
        setLogs((prev) => [...prev.slice(-49), { id: logCounter.current, message, type }]); // Keep last 50 logs
    };

    const handlePlayerAttack = () => {
        // Player Attack
        const damage = player.attack;
        setEnemy((prev) => {
            const newHp = Math.max(0, prev.hp - damage);
            addLog(`シャルロットの『Enterッターン！』攻撃！ ${prev.name} に ${damage} のダメージ！`, "player");

            if (newHp <= 0) {
                handleEnemyDefeat(prev);
                return generateEnemy(stage + 1); // Temporary state, useEffect will sync stage
            }
            return { ...prev, hp: newHp };
        });
    };

    const handleEnemyDefeat = (defeatedEnemy: Enemy) => {
        addLog(`${defeatedEnemy.name} を倒した！`, "reward");

        // Reward
        const expGain = Math.floor(defeatedEnemy.expReward * (1 + upgrades.exp * 0.1));
        const moneyGain = defeatedEnemy.moneyReward;

        addLog(`${moneyGain}円 と ${expGain}XP を獲得！`, "reward");

        setPlayer((prev) => {
            let nextLevel = prev.level;
            let currentExp = prev.exp + expGain;
            let nextLevelExp = prev.nextExp;
            let maxHp = prev.maxHp;
            let hp = prev.hp;
            let attack = prev.attack;

            // Level Up Logic
            while (currentExp >= nextLevelExp) {
                currentExp -= nextLevelExp;
                nextLevel++;
                nextLevelExp = Math.floor(nextLevelExp * 1.2);
                maxHp += 20;
                hp = maxHp; // Full heal on level up
                attack += 5;
                addLog(`レベルアップ！ Lv.${nextLevel} になった！ (HP/ATK上昇)`, "system");
            }

            return {
                ...prev,
                level: nextLevel,
                exp: currentExp,
                nextExp: nextLevelExp,
                maxHp,
                hp, // Heal current HP too? Yes, let's keep it simple or full heal
                attack,
                money: prev.money + moneyGain
            };
        });

        setStage((prev) => {
            const nextStage = prev + 1;
            setEnemy(generateEnemy(nextStage)); // Update Enemy immediately
            addLog(`次の案件: 階層 ${nextStage}F へ移動...`, "system");
            return nextStage;
        });
    };

    const handleEnemyAttack = () => {
        // Enemy Counter Attack (Simplified: only happens if enemy is alive)
        // Note: In a real interval loop, checking enemy HP in closure is tricky.
        // We will do a turn-based check inside the interval ref or effect.

        // Actually, safer to do: Enemy attacks periodically separate from player?
        // Or "Player act -> Enemy act" in same tick?
        // Let's do "Player act -> Enemy act" for simplicity aka Turn Based Auto.

        setPlayer((prev) => {
            if (prev.hp <= 0) return prev; // Already dead

            const dmg = Math.max(1, enemy.attack - Math.floor(prev.level * 0.5)); // Simple defense
            const newHp = Math.max(0, prev.hp - dmg);

            addLog(`${enemy.name} の反撃！ ${dmg} のダメージを受けた！`, "enemy");

            if (newHp <= 0) {
                handleGameOver();
                return { ...prev, hp: 0 };
            }
            return { ...prev, hp: newHp };
        });
    };

    const handleGameOver = () => {
        addLog(`シャルロットは過労で倒れた...`, "enemy");
        setAutoBattle(false);

        setTimeout(() => {
            // Penalty: Back 5 stages (min 1), Heal
            setStage((prev) => {
                const nextStage = Math.max(1, prev - 5);
                setEnemy(generateEnemy(nextStage));
                addLog(`少し前の階層 (${nextStage}F) から業務再開します。`, "system");
                return nextStage;
            });
            setPlayer((prev) => ({ ...prev, hp: prev.maxHp }));
        }, 2000);
    };


    // --- Game Loop ---
    useEffect(() => {
        if (autoBattle && player.hp > 0) {
            attackTimerRef.current = setInterval(() => {
                // We need to access current state inside interval.
                // React state inside interval is stale unless using refs or functional updates.
                // Functional updates are used for setters, but reading 'enemy' state to check HP is hard.
                // WE WILL USE A REF-BASED APPROACH FOR LOGIC or just Functional Setters chain.

                // Let's rely on the fact that if enemy exists, we strike.
                // But we need to know if enemy died in THIS tick to prevent counter attack.
                // Mixing sync logic in interval with React state is messy.
                // Alternative: useRef for Game State, sync to React State for UI.

                // For this scale, let's just trigger "Turn" action.
                setEnemy(currentEnemy => {
                    if (currentEnemy.hp <= 0) return currentEnemy;

                    // Player Attacks Enemy
                    let damage = 0;
                    setPlayer(p => { damage = p.attack; return p; }); // Hacky way to read player attack? No, use ref.
                    // Better: use functional update for everything.

                    // Actually, let's just use refs for the mutable logic loop to be safe and performant
                    return currentEnemy;
                });

                // Simpler approach: Just call a function that uses REFS for current state?
                // No, let's just re-implement the loop with simple functional updates 
                // and assume "Player hits" -> "Enemy hits" sequence.

                handleTurn();

            }, player.attackInterval);
        } else {
            if (attackTimerRef.current) clearInterval(attackTimerRef.current);
        }

        return () => {
            if (attackTimerRef.current) clearInterval(attackTimerRef.current);
        };
    }, [autoBattle, player.attackInterval]); // Re-run if speed changes

    // "Turn" Logic called by Interval
    // We use a helper to chain the state updates cleanly-ish.
    // Since we can't easily read "did enemy die" inside the same render cycle across different state atoms,
    // we will do a check in the Enemy updater.
    const handleTurn = () => {
        // 1. Enemy takes damage
        let enemyDied = false;

        setEnemy((prevEnemy) => {
            if (prevEnemy.hp <= 0) return prevEnemy; // Already dead, waiting for regeneration?

            // Re-read player attack? We can stick player in a ref to read it without dependency cycle?
            // Or "Player act -> Enemy act" in same tick?
            // Let's do "Player act -> Enemy act" for simplicity aka Turn Based Auto.

            // Note: In a real interval loop, checking enemy HP in closure is tricky.
            // We will do a turn-based check inside the interval ref or effect.

            // Actually, safer to do: Enemy attacks periodically separate from player?
            // Or "Player act -> Enemy act" in same tick?
            // Let's do "Player act -> Enemy act" for simplicity aka Turn Based Auto.

            return prevEnemy; // Pass through, handled in specific handlers?
        });

        // This is getting spaghetti. Let's refactor to a single "ProcessTurn" that reads/writes Ref, then syncs.
        processGameTick();
    };

    // --- Ref-based Game Loop (Cleaner) ---
    const gameStateRef = useRef({
        player: INITIAL_PLAYER,
        enemy: generateEnemy(1),
        stage: 1,
        upgrades: { attack: 0, exp: 0, speed: 0 }
    });

    // Sync Ref with State on Load/Changes (One way sync State -> Ref is hard, usually Ref -> State)
    // Let's just use Ref for the interval, and update State for UI.
    // BUT we need State to drive the UI.

    // Let's go back to: Component State is Truth.
    // use `useEffect` with [player, enemy] dependency is bad (loop!).
    // use `useRef` to hold current state for the interval to read.
    const stateRef = useRef({ player, enemy, stage, upgrades });
    useEffect(() => { stateRef.current = { player, enemy, stage, upgrades }; }, [player, enemy, stage, upgrades]);

    const processGameTick = () => {
        const current = stateRef.current;
        if (current.player.hp <= 0) return;

        // Player attacks
        const damage = current.player.attack;
        let newEnemyHp = current.enemy.hp - damage;

        // Log Player Attack
        addLog(`シャルロットの攻撃！ ${current.enemy.name} に ${damage} のダメージ！`, "player");

        if (newEnemyHp <= 0) {
            // Enemy Defeated
            const expGain = Math.floor(current.enemy.expReward * (1 + current.upgrades.exp * 0.1));
            const moneyGain = current.enemy.moneyReward;

            addLog(`${current.enemy.name} を倒した！ ${moneyGain}円, ${expGain}XP GET!`, "reward");

            // Level Up Calc
            let p = { ...current.player };
            p.exp += expGain;
            p.money += moneyGain;

            while (p.exp >= p.nextExp) {
                p.exp -= p.nextExp;
                p.level++;
                p.nextExp = Math.floor(p.nextExp * 1.2);
                p.maxHp += 20;
                p.hp = p.maxHp;
                p.attack += 5;
                addLog(`Level Up! Lv.${p.level} (HP/ATK Up)`, "system");
            }

            // Next Stage
            const nextStage = current.stage + 1;
            const nextEnemy = generateEnemy(nextStage);

            setPlayer(p);
            setStage(nextStage);
            setEnemy(nextEnemy);
            addLog(`次の案件: 階層 ${nextStage}F`, "system");

        } else {
            // Enemy Survives and Counters
            const counterDmg = Math.max(1, current.enemy.attack - Math.floor(current.player.level * 0.5));
            let newPlayerHp = current.player.hp - counterDmg;

            addLog(`${current.enemy.name} の反撃！ ${counterDmg} ゲームを受けました。`, "enemy");

            // Update HP
            setEnemy(prev => ({ ...prev, hp: newEnemyHp }));

            if (newPlayerHp <= 0) {
                setPlayer(prev => ({ ...prev, hp: 0 }));
                handleGameOver(); // uses Log
            } else {
                setPlayer(prev => ({ ...prev, hp: newPlayerHp }));
            }
        }
    };


    // --- Shop Logic ---
    const buyUpgrade = (type: "attack" | "exp" | "speed") => {
        const currentLevel = upgrades[type];
        const cost = UPGRADE_COSTS[type](currentLevel);

        if (player.money >= cost) {
            setPlayer(prev => ({ ...prev, money: prev.money - cost }));
            setUpgrades(prev => ({ ...prev, [type]: prev[type] + 1 }));
            addLog(`${type.toUpperCase()} を強化しました！`, "system");

            // Apply immediate effects
            if (type === "attack") {
                setPlayer(prev => ({ ...prev, attack: prev.attack + 5 }));
            }
            if (type === "speed") {
                setPlayer(prev => ({ ...prev, attackInterval: Math.max(100, prev.attackInterval * 0.9) }));
            }
        } else {
            addLog("お金が足りません！", "system");
        }
    };


    return (
        <main className="min-h-screen bg-background text-foreground py-20">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl md:text-3xl font-bold font-mono mb-6 text-center text-green-400">
                    {"<"} 社畜騎士シャルロットの無限残業RPG {"/>"}
                </h1>

                <div className="flex justify-center mb-6">
                    <Button
                        size="lg"
                        variant={autoBattle ? "secondary" : "default"}
                        onClick={() => setAutoBattle(!autoBattle)}
                        className={`w-48 font-bold text-lg gap-2 ${autoBattle ? "animate-pulse" : ""}`}
                    >
                        {autoBattle ? "残業中 (STOP)" : "業務開始 (START)"}
                        {!autoBattle && <Play className="w-5 h-5" />}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">

                    {/* LEFT: STATUS */}
                    <div className="order-1 lg:order-1 bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col gap-4">
                        <h2 className="text-xl font-bold font-mono border-b border-slate-700 pb-2 text-primary">
                            STATUS
                        </h2>

                        <div className="flex justify-center mb-4">
                            <img src="/images/Line.png" alt="Charlotte" className="w-24 h-24 object-contain rounded-full border-2 border-primary bg-white/10" />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Lv.{player.level} シャルロット</span>
                                    <span>{player.hp} / {player.maxHp} HP</span>
                                </div>
                                <Progress value={(player.hp / player.maxHp) * 100} className="h-4 bg-slate-800" indicatorColor={player.hp < player.maxHp * 0.3 ? "bg-red-500" : "bg-green-500"} />
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1 text-yellow-400">
                                    <span>Next Lv</span>
                                    <span>{player.exp} / {player.nextExp} XP</span>
                                </div>
                                <Progress value={(player.exp / player.nextExp) * 100} className="h-2 bg-slate-800" indicatorColor="bg-yellow-500" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700 font-mono text-sm">
                                <div>
                                    <span className="text-slate-500">ATK:</span> {player.attack}
                                </div>
                                <div>
                                    <span className="text-slate-500">SPD:</span> {(player.attackInterval / 1000).toFixed(1)}s
                                </div>
                                <div className="col-span-2 text-xl font-bold text-yellow-500">
                                    ¥ {player.money.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto bg-slate-800 p-4 rounded-lg">
                            <h3 className="text-sm text-slate-400 mb-2">CURRENT PROJECT</h3>
                            <p className="text-lg font-bold text-white">{enemy.name}</p>
                            <Progress value={(enemy.hp / enemy.maxHp) * 100} className="h-2 mt-2 bg-slate-700" indicatorColor="bg-red-500" />
                            <p className="text-right text-xs text-red-400 mt-1">{enemy.hp} / {enemy.maxHp}</p>
                        </div>
                    </div>

                    {/* CENTER: LOG */}
                    <div className="order-3 lg:order-2 bg-black border border-green-900/50 rounded-xl p-4 font-mono text-sm overflow-hidden flex flex-col shadow-[0_0_20px_rgba(0,255,0,0.1)] h-64 lg:h-auto">
                        <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                            {logs.map((log) => (
                                <div key={log.id} className={`
                                    ${log.type === 'player' ? 'text-green-400' : ''}
                                    ${log.type === 'enemy' ? 'text-red-400' : ''}
                                    ${log.type === 'reward' ? 'text-yellow-400 font-bold' : ''}
                                    ${log.type === 'system' ? 'text-slate-400' : ''}
                                `}>
                                    <span className="opacity-50 mr-2">[{log.id}]</span>
                                    {log.message}
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    </div>

                    {/* RIGHT: SHOP */}
                    <div className="order-2 lg:order-3 bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col gap-4">
                        <h2 className="text-xl font-bold font-mono border-b border-slate-700 pb-2 text-yellow-500">
                            SHOP
                        </h2>
                        <p className="text-xs text-slate-400">貯めた残業代で環境を改善しよう</p>

                        <div className="space-y-3 mt-2">
                            <Button
                                variant="outline"
                                className="w-full h-auto flex flex-col items-start p-4 hover:bg-slate-800 border-slate-700"
                                onClick={() => buyUpgrade("attack")}
                                disabled={player.money < UPGRADE_COSTS.attack(upgrades.attack)}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <Coffee className="w-5 h-5 text-amber-600" />
                                    <span className="font-bold">カフェラテ摂取</span>
                                </div>
                                <div className="flex justify-between w-full mt-2 text-xs">
                                    <span className="text-slate-400">攻撃力UP (Lv.{upgrades.attack})</span>
                                    <span className="text-yellow-500">¥{UPGRADE_COSTS.attack(upgrades.attack).toLocaleString()}</span>
                                </div>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full h-auto flex flex-col items-start p-4 hover:bg-slate-800 border-slate-700"
                                onClick={() => buyUpgrade("exp")}
                                disabled={player.money < UPGRADE_COSTS.exp(upgrades.exp)}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <Book className="w-5 h-5 text-blue-400" />
                                    <span className="font-bold">技術書を読む</span>
                                </div>
                                <div className="flex justify-between w-full mt-2 text-xs">
                                    <span className="text-slate-400">XP効率UP (Lv.{upgrades.exp})</span>
                                    <span className="text-yellow-500">¥{UPGRADE_COSTS.exp(upgrades.exp).toLocaleString()}</span>
                                </div>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full h-auto flex flex-col items-start p-4 hover:bg-slate-800 border-slate-700"
                                onClick={() => buyUpgrade("speed")}
                                disabled={player.money < UPGRADE_COSTS.speed(upgrades.speed)}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <Monitor className="w-5 h-5 text-purple-400" />
                                    <span className="font-bold">PCスペック増強</span>
                                </div>
                                <div className="flex justify-between w-full mt-2 text-xs">
                                    <span className="text-slate-400">速度UP (Lv.{upgrades.speed})</span>
                                    <span className="text-yellow-500">¥{UPGRADE_COSTS.speed(upgrades.speed).toLocaleString()}</span>
                                </div>
                            </Button>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-700">
                            <Button
                                variant="ghost"
                                className="w-full text-slate-500 hover:text-red-500"
                                onClick={() => {
                                    if (confirm("データを初期化しますか？")) {
                                        localStorage.removeItem("rpg_save_data_v1");
                                        window.location.reload();
                                    }
                                }}
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                データ初期化
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
