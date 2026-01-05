import { useState, useEffect, useCallback } from 'react';

export type Item = {
    id: string;
    name: string;
    price: number;
    cps: number; // currency per second
    desc: string;
    count: number;
};

const ITEMS_INITIAL: Item[] = [
    { id: 'coffee', name: '至高のカフェラテ', price: 500, cps: 10, desc: 'カフェイン摂取で効率アップ', count: 0 },
    { id: 'sister', name: '妹の応援', price: 2000, cps: 50, desc: '精神的支柱', count: 0 },
    { id: 'ai', name: '最強の生成AI', price: 10000, cps: 300, desc: 'コードを自動生成', count: 0 },
];

export function useClickerGame() {
    const [money, setMoney] = useState(0);
    const [items, setItems] = useState<Item[]>(ITEMS_INITIAL);
    const [loaded, setLoaded] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('genkai_clicker_save');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setMoney(parsed.money || 0);
                // Merge saved items with initial structure to handle upgrades/schema changes safe-ish
                const savedItems = parsed.items || [];
                setItems(prev => prev.map(item => {
                    const saved = savedItems.find((i: any) => i.id === item.id);
                    return saved ? { ...item, count: saved.count } : item;
                }));
            } catch (e) {
                console.error("Failed to load save", e);
            }
        }
        setLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (!loaded) return;
        const saveState = { money, items };
        localStorage.setItem('genkai_clicker_save', JSON.stringify(saveState));
    }, [money, items, loaded]);

    // Auto Income
    useEffect(() => {
        if (!loaded) return;
        const totalCps = items.reduce((acc, item) => acc + (item.cps * item.count), 0);
        if (totalCps === 0) return;

        const interval = setInterval(() => {
            setMoney(prev => prev + totalCps);
        }, 1000);

        return () => clearInterval(interval);
    }, [items, loaded]);

    const clickBug = useCallback(() => {
        setMoney(prev => prev + 1); // Base click value
        // Maybe verify/return click value for UI effect
        return 1;
    }, []);

    const buyItem = useCallback((itemId: string) => {
        setItems(prev => {
            const newItems = [...prev];
            const index = newItems.findIndex(i => i.id === itemId);
            if (index === -1) return prev;

            const item = newItems[index];
            if (money >= item.price) {
                setMoney(m => m - item.price);
                // Price increase logic? "Normal clicker games increase price". 
                // User didn't specify price increase, so I'll keep it simple: Fixed price OR simple multiplier.
                // Prompt says: "Price: 500 yen". Doesn't explicitly say "increases".
                // I will implement standard 1.15x multiplier for fun/balancing if I can, or stick to user specs.
                // User spec: "Item 1: 500 yen". Just that. 
                // I will stick to STATIC price to strictly follow the prompt "Price: 500 yen". 
                // Changing it might violate "User rules" if interpreted strictly, but games usually scale.
                // I'll stick to static to be safe, or maybe just linear. 
                // Wait, infinite money means scaling is needed or it breaks.
                // But user said "Addictive". Static price makes it too easy quickly.
                // I will add a small text "(Price increases)" and implement it.
                // Actually, let's just stick to User Spec EXACTLY: "Price: 500 Yen". 
                // I will NOT increase price to avoid deviating from "Price: 500 Yen".
                newItems[index] = { ...item, count: item.count + 1 };
                return newItems;
            }
            return prev;
        });
    }, [money]);

    const totalCps = items.reduce((acc, item) => acc + (item.cps * item.count), 0);

    return { money, items, buyItem, clickBug, totalCps, loaded };
}
