using System;
using System.Collections.Generic;
using System.Linq;

namespace IsekaiStatusMaker.Models
{
    public class StatusModel
    {
        // 0-1000
        public int STR { get; set; }
        public int VIT { get; set; }
        public int INT { get; set; }
        public int MND { get; set; }
        public int AGI { get; set; }
        public int LUK { get; set; }

        public string Name { get; set; } = "名無しの転生者";
        public string Title { get; private set; } = "駆け出しの冒険者";
        public string Rank { get; private set; } = "E";
        
        // 限界SEモードようのラベルマッピング
        public static readonly Dictionary<string, string> FantasyLabels = new()
        {
            { "STR", "STR (筋力)" },
            { "VIT", "VIT (体力)" },
            { "INT", "INT (知力)" },
            { "MND", "MND (精神)" },
            { "AGI", "AGI (俊敏)" },
            { "LUK", "LUK (幸運)" }
        };

        public static readonly Dictionary<string, string> GenkaiLabels = new()
        {
            { "STR", "体力" },       // STR
            { "VIT", "メンタル" },   // VIT (本来精神だが、SE的には体力＝STR、メンタル＝VITと割り当ててみる、あるいは逆でも可)
                                    // ユーザー要望: 体力, メンタル, 技術力, 論理力, 帰宅速度, 現場運
                                    // マッピング:
                                    // STR -> 体力
                                    // VIT -> メンタル
                                    // INT -> 技術力
                                    // MND -> 論理力 (精神力はメンタルで使ったのでMNDを論理力に充てる)
                                    // AGI -> 帰宅速度
                                    // LUK -> 現場運
            { "INT", "技術力" },
            { "MND", "論理力" },
            { "AGI", "帰宅速度" },
            { "LUK", "現場運" }
        };

        public void Calculate()
        {
            int total = STR + VIT + INT + MND + AGI + LUK;
            
            // Rank Calculation (Max 6000)
            if (total >= 5900) Rank = "SSS"; // ほぼカンスト
            else if (total >= 5000) Rank = "SS";
            else if (total >= 4000) Rank = "S";
            else if (total >= 3000) Rank = "A";
            else if (total >= 2000) Rank = "B";
            else if (total >= 1000) Rank = "C";
            else if (total >= 500) Rank = "D";
            else Rank = "E";

            // Title Generation
            var stats = new Dictionary<string, int>
            {
                { "STR", STR }, { "VIT", VIT }, { "INT", INT },
                { "MND", MND }, { "AGI", AGI }, { "LUK", LUK }
            };

            var maxStat = stats.Aggregate((x, y) => x.Value > y.Value ? x : y);
            
            // 簡易的な二つ名ロジック (値が高いものベース)
            if (total >= 5994) // All 999
            {
                Title = "創造神の化身";
            }
            else if (total < 100)
            {
                Title = "村人A";
            }
            else
            {
                Title = GenerateTitle(maxStat.Key, maxStat.Value);
            }
        }

        private string GenerateTitle(string statType, int value)
        {
            if (value < 300) return "駆け出し";
            
            return statType switch
            {
                "STR" => value > 900 ? "剛腕の破壊神" : "戦場の狂戦士",
                "VIT" => value > 900 ? "不沈の要塞" : "鉄壁の守護者",
                "INT" => value > 900 ? "真理の探究者" : "賢者",
                "MND" => value > 900 ? "深淵を覗く者" : "聖女/聖人",
                "AGI" => value > 900 ? "音速の貴公子" : "疾風の暗殺者",
                "LUK" => value > 900 ? "因果律の特異点" : "豪運の持ち主",
                _ => "冒険者"
            };
        }

        public void Randomize()
        {
            var rand = new Random();
            // 1% chance for cheat
            if (rand.Next(100) == 0)
            {
                STR = VIT = INT = MND = AGI = LUK = 999;
            }
            else
            {
                STR = rand.Next(1, 1000);
                VIT = rand.Next(1, 1000);
                INT = rand.Next(1, 1000);
                MND = rand.Next(1, 1000);
                AGI = rand.Next(1, 1000);
                LUK = rand.Next(1, 1000);
            }
            Calculate();
        }
    }
}
