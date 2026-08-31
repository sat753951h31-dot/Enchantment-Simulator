// ==========================================================================
// 🛡️ 装備品・強化・精錬マスターデータベース (整理データ・複数成長パターン分岐型)
// ==========================================================================

// 1. 強化レベルごとの上昇値マスター
// 💡 ステータスを親キーにして、1つ付き特化と2つ付きハイブリッドの上昇値の違いを完璧に分離します！
const enhanceStatMaster = {
    "物理増強": {
        "アクセ_2つ付き型": 3, 
        "お守り_2つ付き型": 6,
        "アクセ_1つ付き型": 6, 
        "お守り_1つ付き型": 12
    },
    "魔法増強": {
        "アクセ_2つ付き型": 3, 
        "お守り_2つ付き型": 6,
        "アクセ_1つ付き型": 6, 
        "お守り_1つ付き型": 12
    },
    "物理貫通": {
        "片手武器": 2,
        "アクセ_2つ付き型": 2, 
        "お守り_2つ付き型": 3, 
        "アクセ_1つ付き型": 4,
        "お守り_1つ付き型": 5
    },
    "魔法貫通": {
        "アクセ_2つ付き型": 2,
        "お守り_2つ付き型": 3  
    },
    "PVP物理増強": {
        "アクセ_2つ付き型": 2, 
        "お守り_2つ付き型": 3  
    },
    "PVP魔法増強": {
        "盾": 2,
        "アクセ_2つ付き型": 2,
        "お守り_2つ付き型": 3  
    },
    "物理攻撃": {
        "片手武器": 4,
        "短剣": 4,
        "両手武器": 6,
        "お守り_2つ付き型": 3  
    },
    "CRI": {
        "アクセ_2つ付き型": 2
    },
    "ヘイスト": {
        "短剣": 2,
        "両手武器": 3
    },
    "APSD": {
        "両手武器": 3
    },
    "MaxHP": {
        "盾": 78,
        "肩": 94,
        "靴": 125,
        "肩_白": 94,
        "靴_白": 125
    },
    "物理防御": {
        "盾": 2,
        "鎧_白": 2,
        "肩_白": 1
    },
    "物理ダメージ軽減": {
        "盾": 3
    },
    "魔法防御": {
        "盾": 2,
        "鎧_白": 1,
        "靴_白": 1
    },
    "魔法ダメージ軽減": {
        "盾": 3
    },
    "PVP物理ダメージ軽減": {
        "鎧": 2
    },
    "PVP魔法ダメージ軽減": {
        "盾": 1,
        "鎧": 1
    }
};

// 2. 精錬レベルごとのボーナスマスター
const refineStatMaster = {
    "最終物理増強": {
        "アクセ_2つ付き型": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 },
        "お守り_2つ付き型": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 }
    },
    "最終魔法増強": {
        "アクセ_2つ付き型": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 },
        "お守り_2つ付き型": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 }
    },
    "最終物理貫通": {
        "片手武器": {"1": 6, "2": 12, "3": 18, "4": 24, "5": 30,"6": 36, "7": 42, "8": 48, "9": 54, "10": 60,"11": 66, "12": 72, "13": 78, "14": 84, "15": 90},
        "アクセ_2つ付き型": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 }, 
        "お守り_2つ付き型": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 }  
    },
    "最終魔法貫通": {
        "片手武器": {"1": 6, "2": 12, "3": 18, "4": 24, "5": 30,"6": 36, "7": 42, "8": 48, "9": 54, "10": 60,"11": 66, "12": 72, "13": 78, "14": 84, "15": 90},
        "アクセ_2つ付き型": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 },
        "お守り_2つ付き型": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 }  
    },
    "PVP最終物理増強": {
        "盾": {"1": 2.6,"2": 5.2,"3": 7.8,"4": 10.4,"5": 13.0,"6": 15.6,"7": 18.2,"8": 20.8,"9": 23.4,"10": 26.0,"11": 28.6,"12": 31.2,"13": 33.8,"14": 36.4,"15": 39.0},
        "アクセ_2つ付き型": { "1": 4, "2": 8, "3": 12, "4": 16, "5": 20, "6": 24, "7": 28, "8": 32, "9": 36, "10": 40, "11": 44, "12": 48, "13": 52, "14": 56, "15": 60 },
        "お守り_2つ付き型": { "1": 4, "2": 8, "3": 12, "4": 16, "5": 20, "6": 24, "7": 28, "8": 32, "9": 36, "10": 40, "11": 44, "12": 48, "13": 52, "14": 56, "15": 60 } 
    },
    "PVP最終魔法増強": {
        "盾": {"1": 2.6,"2": 5.2,"3": 7.8,"4": 10.4,"5": 13.0,"6": 15.6,"7": 18.2,"8": 20.8,"9": 23.4,"10": 26.0,"11": 28.6,"12": 31.2,"13": 33.8,"14": 36.4,"15": 39.0},
        "アクセ_2つ付き型": { "1": 4, "2": 8, "3": 12, "4": 16, "5": 20, "6": 24, "7": 28, "8": 32, "9": 36, "10": 40, "11": 44, "12": 48, "13": 52, "14": 56, "15": 60 },
        "お守り_2つ付き型": { "1": 4, "2": 8, "3": 12, "4": 16, "5": 20, "6": 24, "7": 28, "8": 32, "9": 36, "10": 40, "11": 44, "12": 48, "13": 52, "14": 56, "15": 60 } 
    },
    "CRIダメージ": {
        "お守り_2つ付き型": { "1": 4, "2": 8, "3": 12, "4": 16, "5": 20, "6": 24, "7": 28, "8": 32, "9": 36, "10": 40, "11": 44, "12": 48, "13": 52, "14": 56, "15": 60 }
    },
    "最終CRI": {
        "アクセ_2つ付き型": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 }
    },
    "最終物理攻撃": {
        "片手武器": {"1": 6, "2": 12, "3": 18, "4": 24, "5": 30,"6": 36, "7": 42, "8": 48, "9": 54, "10": 60,"11": 66, "12": 72, "13": 78, "14": 84, "15": 90},
        "短剣": {"1": 6, "2": 12, "3": 18, "4": 24, "5": 30,"6": 36, "7": 42, "8": 48, "9": 54, "10": 60,"11": 66, "12": 72, "13": 78, "14": 84, "15": 90},
        "両手武器": {"1": 11, "2": 22, "3": 33, "4": 44, "5": 55,"6": 66, "7": 77, "8": 88, "9": 99, "10": 110,"11": 121, "12": 132, "13": 143, "14": 154, "15": 165}
    },
    "最終魔法攻撃": {
        "片手武器": {"1": 6, "2": 12, "3": 18, "4": 24, "5": 30,"6": 36, "7": 42, "8": 48, "9": 54, "10": 60,"11": 66, "12": 72, "13": 78, "14": 84, "15": 90},
        "両手武器": {"1": 11, "2": 22, "3": 33, "4": 44, "5": 55,"6": 66, "7": 77, "8": 88, "9": 99, "10": 110,"11": 121, "12": 132, "13": 143, "14": 154, "15": 165}
    },
    "最終HP": {
        "盾": {"1": 4, "2": 8, "3": 12, "4": 16, "5": 20,"6": 24, "7": 28, "8": 32, "9": 36, "10": 40,"11": 44, "12": 48, "13": 52, "14": 56, "15": 60},
        "肩": {"1": 4, "2": 8, "3": 12, "4": 16, "5": 20,"6": 24, "7": 28, "8": 32, "9": 36, "10": 40,"11": 44, "12": 48, "13": 52, "14": 56, "15": 60},
        "靴": {"1": 6, "2": 12, "3": 18, "4": 24, "5": 30,"6": 36, "7": 42, "8": 48, "9": 54, "10": 60,"11": 66, "12": 72, "13": 78, "14": 84, "15": 90},
        "肩_白": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 },
        "靴_白": {"1": 3, "2": 6, "3": 9, "4": 12, "5": 15,"6": 18, "7": 21, "8": 24, "9": 27, "10": 30,"11": 33, "12": 36, "13": 39, "14": 42, "15": 45}
    },
    "最終HP2": {
        "盾": {"1": 5.6,"2": 8.2,"3": 10.8,"4": 13.4,"5": 16.0,"6": 18.6,"7": 21.2,"8": 23.8,"9": 26.4,"10": 29.0,"11": 31.6,"12": 34.2,"13": 36.8,"14": 39.4,"15": 42.0 }
    },
    "最終ヘイスト": {
        "短剣": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 },
        "両手武器": {"1": 3, "2": 6, "3": 9, "4": 12, "5": 15,"6": 18, "7": 21, "8": 24, "9": 27, "10": 30,"11": 33, "12": 36, "13": 39, "14": 42, "15": 45}
    },
    "最終APSD": {
        "両手武器": {"1": 34, "2": 68, "3": 102, "4": 136, "5": 170,"6": 204, "7": 238, "8": 272, "9": 306, "10": 340,"11": 374, "12": 408, "13": 442, "14": 476, "15": 510}
    },
    "最終物理防御": {
        "盾": {"1": 4, "2": 8, "3": 12, "4": 16, "5": 20,"6": 24, "7": 28, "8": 32, "9": 36, "10": 40,"11": 44, "12": 48, "13": 52, "14": 56, "15": 60},
        "鎧_白": {"1": 3, "2": 6, "3": 9, "4": 12, "5": 15,"6": 18, "7": 21, "8": 24, "9": 27, "10": 30,"11": 33, "12": 36, "13": 39, "14": 42, "15": 45},
        "肩_白": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 }
    },
    "最終物理ダメージ軽減": {
        "盾": {"1": 4, "2": 8, "3": 12, "4": 16, "5": 20,"6": 24, "7": 28, "8": 32, "9": 36, "10": 40,"11": 44, "12": 48, "13": 52, "14": 56, "15": 60}
    },
    "最終魔法防御": {
        "盾": {"1": 4, "2": 8, "3": 12, "4": 16, "5": 20,"6": 24, "7": 28, "8": 32, "9": 36, "10": 40,"11": 44, "12": 48, "13": 52, "14": 56, "15": 60},
        "鎧_白": {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5,"6": 6, "7": 7, "8": 8, "9": 9, "10": 10,"11": 11, "12": 12, "13": 13, "14": 14, "15": 15},
        "靴_白": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 }
    },
    "最終魔法ダメージ軽減": {
        "盾": {"1": 4, "2": 8, "3": 12, "4": 16, "5": 20,"6": 24, "7": 28, "8": 32, "9": 36, "10": 40,"11": 44, "12": 48, "13": 52, "14": 56, "15": 60}
    },
    "PVP最終物理ダメージ軽減": {
        "鎧": {"1": 6, "2": 12, "3": 18, "4": 24, "5": 30,"6": 36, "7": 42, "8": 48, "9": 54, "10": 60,"11": 66, "12": 72, "13": 78, "14": 84, "15": 90},
        "肩": {"1": 4, "2": 8, "3": 12, "4": 16, "5": 20,"6": 24, "7": 28, "8": 32, "9": 36, "10": 40,"11": 44, "12": 48, "13": 52, "14": 56, "15": 60},
        "盾": {"1": 4, "2": 8, "3": 12, "4": 16, "5": 20,"6": 24, "7": 28, "8": 32, "9": 36, "10": 40,"11": 44, "12": 48, "13": 52, "14": 56, "15": 60}
    },
    "PVP最終魔法ダメージ軽減": {
        "鎧": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 },
        "靴": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14, "8": 16, "9": 18, "10": 20, "11": 22, "12": 24, "13": 26, "14": 28, "15": 30 },
        "盾": {"1": 4, "2": 8, "3": 12, "4": 16, "5": 20,"6": 24, "7": 28, "8": 32, "9": 36, "10": 40,"11": 44, "12": 48, "13": 52, "14": 56, "15": 60}
    }
};


// 3. 【各装備品】個別マスター
// 💡 categoryには、自分が「どの部位の、何の成長型マスタ」を覗きに行くべきかのフルネームを正確に割り当てます
const equipmentItemMaster = {
    "item_acc_shrimp": {
        "name": "えびニッパのイヤリング",
        "category": "アクセ_2つ付き型", 
        "base_effects": [
            { "type": "最終物理貫通", "value": 4.3, "is_percent": true },
            { "type": "物理貫通", "value": 104, "is_percent": false },
            { "type": "物理増強", "value": 311, "is_percent": false }
        ],
        "enhance_effects_types": ["物理貫通", "物理増強"],
        "refine_effects_types": ["最終物理貫通", "最終物理増強"]
    },
    "item_acc_shrimp_ring": {
        "name": "えびニッパの指輪",
        "category": "アクセ_2つ付き型", 
        "base_effects": [
            { "type": "最終魔法貫通", "value": 4.3, "is_percent": true },
            { "type": "魔法貫通", "value": 104, "is_percent": false },
            { "type": "魔法増強", "value": 311, "is_percent": false }
        ],
        "enhance_effects_types": ["魔法貫通", "魔法増強"],
        "refine_effects_types": ["最終魔法貫通", "最終魔法増強"]
    },
    "item_acc_hidden_blade": {
        "name": "ブラッククロスネックレス",
        "category": "アクセ_2つ付き型",
        "base_effects": [
            { "type": "最終物理増強", "value": 6.6, "is_percent": true },
            { "type": "物理増強", "value": 694, "is_percent": false },
            { "type": "PVP物理増強", "value": 174, "is_percent": false }
        ],
        "enhance_effects_types": ["物理増強", "PVP物理増強"],
        "refine_effects_types": ["最終物理増強", "PVP最終物理増強"]
    },
    "item_acc_prisoner_ring": {
        "name": "囚人の指輪",
        "category": "アクセ_2つ付き型",
        "base_effects": [
            { "type": "最終魔法増強", "value": 6.6, "is_percent": true },
            { "type": "魔法増強", "value": 694, "is_percent": false },
            { "type": "PVP魔法増強", "value": 174, "is_percent": false }
        ],
        "enhance_effects_types": ["魔法増強", "PVP魔法増強"],
        "refine_effects_types": ["最終魔法増強", "PVP最終魔法増強"]
    },
    "item_acc_dawn_bead": {
        "name": "暁の宝珠",
        "category": "お守り_2つ付き型",
        "base_effects": [
            { "type": "PVP最終物理増強", "value": 21.9, "is_percent": true },
            { "type": "物理貫通", "value": 521, "is_percent": false },
            { "type": "PVP物理増強", "value": 521, "is_percent": false }
        ],
        "enhance_effects_types": ["物理貫通", "PVP物理増強"],
        "refine_effects_types": ["最終物理貫通", "PVP最終物理増強"]
    },
    "item_acc_iron_emblem": {
        "name": "黒鉄の紋章",
        "category": "お守り_2つ付き型",
        "base_effects": [
            { "type": "PVP最終魔法増強", "value": 21.9, "is_percent": true },
            { "type": "魔法貫通", "value": 521, "is_percent": false },
            { "type": "PVP魔法増強", "value": 521, "is_percent": false }
        ],
        "enhance_effects_types": ["魔法貫通", "PVP魔法増強"],
        "refine_effects_types": ["最終魔法貫通", "PVP最終魔法増強"]
    },
    "item_acc_red_lantern": {
        "name": "赤いランタン",
        "category": "お守り_2つ付き型",
        "base_effects": [
            { "type": "PVP最終物理増強", "value": 21.9, "is_percent": true },
            { "type": "物理攻撃", "value": 521, "is_percent": false },
            { "type": "PVP物理増強", "value": 521, "is_percent": false }
        ],
        "enhance_effects_types": ["物理攻撃", "PVP物理増強"],
        "refine_effects_types": ["CRIダメージ", "PVP最終物理増強"]
    },
    "item_acc_fog_earring": {
        "name": "霧のイヤリング",
        "category": "アクセ_2つ付き型",
        "base_effects": [
            { "type": "最終物理貫通", "value": 7.6, "is_percent": true },
            { "type": "物理貫通", "value": 313, "is_percent": false },
            { "type": "PVP物理増強", "value": 313, "is_percent": false }
        ],
        "enhance_effects_types": ["物理貫通", "PVP物理増強"],
        "refine_effects_types": ["最終物理貫通", "PVP最終物理増強"]
    },
    "item_acc_silver_necklace": {
        "name": "銀の装飾ネックレス",
        "category": "アクセ_2つ付き型",
        "base_effects": [
            { "type": "最終魔法貫通", "value": 7.6, "is_percent": true },
            { "type": "魔法貫通", "value": 313, "is_percent": false },
            { "type": "PVP魔法増強", "value": 313, "is_percent": false }
        ],
        "enhance_effects_types": ["魔法貫通", "PVP魔法増強"],
        "refine_effects_types": ["最終魔法貫通", "PVP最終魔法増強"]
    },
    "item_acc_guilty_symbol": {
        "name": "ギルティシンボル",
        "category": "アクセ_2つ付き型",
        "base_effects": [
            { "type": "CRIダメージ", "value": 12.6, "is_percent": true },
            { "type": "CRI", "value": 313, "is_percent": false },
            { "type": "PVP物理増強", "value": 313, "is_percent": false }
        ],
        "enhance_effects_types": ["CRI", "PVP物理増強"],
        "refine_effects_types": ["最終CRI", "PVP最終物理増強"]
    },
    "item_acc_demon_worshiper_talisman": {
        "name": "悪魔崇拝者のお守り",
        "category": "お守り_2つ付き型",
        "base_effects": [
            { "type": "最終魔法増強", "value": 8.7, "is_percent": true },
            { "type": "PVP最終魔法増強", "value": 14.5, "is_percent": true },
            { "type": "魔法増強", "value": 1500, "is_percent": false },
            { "type": "PVP魔法増強", "value": 750, "is_percent": false }
        ],
        "enhance_effects_types": ["魔法増強", "PVP魔法増強"],
        "refine_effects_types": ["最終魔法増強", "PVP最終魔法増強"]
    },
    "item_acc_stardust_talisman": {
        "name": "星屑のお守り",
        "category": "お守り_2つ付き型",
        "base_effects": [
            { "type": "最終物理増強", "value": 8.7, "is_percent": true },
            { "type": "PVP最終物理増強", "value": 14.5, "is_percent": true },
            { "type": "物理増強", "value": 1500, "is_percent": false },
            { "type": "PVP物理増強", "value": 750, "is_percent": false }
        ],
        "enhance_effects_types": ["物理増強", "PVP物理増強"],
        "refine_effects_types": ["最終物理増強", "PVP最終物理増強"]
    },
    "item_shield_tantrum": {
        "name": "癇癪の盾",
        "category": "盾",

        "base_effects": [
            { "type": "MaxHP", "value": 18750, "is_percent": false },
            { "type": "PVP物理増強", "value": 375, "is_percent": false }
        ],

        "enhance_effects_types": ["MaxHP", "PVP物理増強"],
        "refine_effects_types": ["最終HP2", "PVP最終物理増強"],
        "effects_special": [
            {
                "trigger": "PVP戦闘開始時",
                "interval_sec": 30,
                "effects": [
                    { "type": "ヘイスト", "value": -15, "is_percent": true },
                    { "type": "PVP物理増強", "value": 10, "is_percent": true },
                    { "type": "PVP魔法増強", "value": 5, "is_percent": true }
                ],
                "persist_after_battle": true
            }
        ]
    },
    "item_shield_silence": {
        "name": "沈黙の盾",
        "category": "盾",

        "base_effects": [
            { "type": "MaxHP", "value": 18750, "is_percent": false },
            { "type": "PVP魔法増強", "value": 375, "is_percent": false }
        ],

        "enhance_effects_types": ["MaxHP", "PVP魔法増強"],
        "refine_effects_types": ["最終HP2", "PVP最終魔法増強"],

        "effects_special": [
            {
                "trigger": "PVP戦闘開始時",
                "interval_sec": 30,
                "effects": [
                    { "type": "ヘイスト", "value": -15, "is_percent": true },
                    { "type": "PVP物理増強", "value": 10, "is_percent": true },
                    { "type": "PVP魔法増強", "value": 5, "is_percent": true }
                ],
                "persist_after_battle": true
            }
        ]
    },
    "item_shield_gigant": {
        "name": "ギガントシールド",
        "category": "盾",
        "base_effects": [
            { "type": "物理防御", "value": 104, "is_percent": false },
            { "type": "物理ダメージ軽減", "value": 311, "is_percent": false }
        ],

        "enhance_effects_types": ["物理防御", "物理ダメージ軽減"],
        "refine_effects_types": ["最終物理防御", "最終物理ダメージ軽減"],

        "effects_special": [
            {
                "trigger": "常時",
                "effects": [
                    { "type": "物理ダメージ反射", "value": 9, "is_percent": true },
                    { "type": "魔法ダメージ反射", "value": 9, "is_percent": true }
                ]
            }
        ]
    },
    "item_shield_karasack": {
        "name": "カラサック",
        "category": "盾",

        "base_effects": [
            { "type": "魔法防御", "value": 104, "is_percent": false },
            { "type": "魔法ダメージ軽減", "value": 311, "is_percent": false }
        ],

        "enhance_effects_types": ["魔法防御", "魔法ダメージ軽減"],
        "refine_effects_types": ["最終魔法防御", "最終魔法ダメージ軽減"],

        "effects_special": [
            {
                "trigger": "常時",
                "effects": [
                    { "type": "物理ダメージ反射", "value": 9, "is_percent": true },
                    { "type": "魔法ダメージ反射", "value": 9, "is_percent": true }
                ]
            }
        ]
    },
    "item_shield_rosa": {
        "name": "ローザシールド",
        "category": "盾",

        "base_effects": [
            { "type": "MaxHP", "value": 13021, "is_percent": false },
            { "type": "PVP物理ダメージ軽減", "value": 260, "is_percent": false }
        ],

        "enhance_effects_types": ["MaxHP", "PVP物理ダメージ軽減"],
        "refine_effects_types": ["最終HP", "PVP最終物理ダメージ軽減"],

        "effects_special": [
            {
                "trigger": "常時",
                "effects": [
                    { "type": "デバフ解除", "value": 1, "is_percent": false }
                ]
            }
        ]
    },
    "item_shield_kongo": {
        "name": "金剛石の盾",
        "category": "盾_特殊型",

        "base_effects": [
            { "type": "MaxHP", "value": 13021, "is_percent": false },
            { "type": "PVP魔法ダメージ軽減", "value": 260, "is_percent": false }
        ],

        "enhance_effects_types": ["MaxHP", "PVP魔法ダメージ軽減"],
        "refine_effects_types": ["最終HP", "PVP最終魔法ダメージ軽減"],

        "effects_special": [
            {
                "trigger": "常時",
                "effects": [
                    { "type": "デバフ解除", "value": 1, "is_percent": false }
                ]
            }
        ]
    },
    "item_sword_formless": {
        "name": "無形剣",
        "category": "片手武器",

        "base_effects": [
            { "type": "物理攻撃", "value": 185, "is_percent": false },
            { "type": "物理貫通", "value": 93, "is_percent": false }
        ],

        "enhance_effects_types": ["物理攻撃", "物理貫通"],
        "refine_effects_types": ["最終物理攻撃", "最終物理貫通"],

        "effects_special": [
            {
                "trigger": "攻撃時",
                "effects": [
                    { "type": "物理防御無視", "value": 15, "is_percent": true }
                ]
            }
        ]
    },
    "item_staff_priest": {
        "name": "神官の杖",
        "category": "片手武器",

        "base_effects": [
            { "type": "魔法攻撃", "value": 185, "is_percent": false },
            { "type": "魔法貫通", "value": 93, "is_percent": false }
        ],

        "enhance_effects_types": ["魔法攻撃", "魔法貫通"],
        "refine_effects_types": ["最終魔法攻撃", "最終魔法貫通"],

        "effects_special": [
            {
                "trigger": "攻撃時",
                "effects": [
                    { "type": "魔法防御無視", "value": 15, "is_percent": true }
                ]
            }
        ]
    },
    "item_staff_blasfemi": {
        "name": "ブラスフェミクロス",
        "category": "両手武器",

        "base_effects": [
            { "type": "魔法攻撃", "value": 1042, "is_percent": false },
            { "type": "ヘイスト", "value": 521, "is_percent": false }
        ],

        "enhance_effects_types": ["魔法攻撃", "ヘイスト"],

        "refine_effects_types": ["最終魔法攻撃", "最終ヘイスト"],

        "effects_special": [
            {
                "trigger": "PVPスキル使用時",
                "effects": [
                    { "type": "追加固定ダメージ", "value": 3, "is_percent": true },
                    { "type": "発動間隔", "value": 4, "is_percent": false }
                ]
            }
        ]
    },
    "item_dagger_dragonkiller": {
        "name": "ドラゴンキラー",
        "category": "短剣",

        "base_effects": [
            { "type": "物理攻撃", "value": 139, "is_percent": false },
            { "type": "ヘイスト", "value": 69, "is_percent": false }
        ],

        "enhance_effects_types": ["物理攻撃", "ヘイスト"],

        "refine_effects_types": ["最終物理攻撃", "最終ヘイスト"],

        "effects_special": [
            {
                "trigger": "スキル使用時",
                "effects": [
                    { "type": "闘業スキルCD解除", "value": 8, "is_percent": true }
                ]
            }
        ]
    },
    "item_armor_gov_heavy": {
        "name": "ゴヴニュの鎧・重",
        "category": "鎧",

        "base_effects": [
            { "type": "PVP物理ダメージ軽減", "value": 104, "is_percent": false },
            { "type": "PVP魔法ダメージ軽減", "value": 35, "is_percent": false }
        ],

        "enhance_effects_types": [
            "PVP物理ダメージ軽減",
            "PVP魔法ダメージ軽減"
        ],

        "refine_effects_types": [
            "PVP最終物理ダメージ軽減",
            "PVP最終魔法ダメージ軽減"
        ],

        "effects_special": []
    },
    "item_shoulder_gov_heavy": {
        "name": "ゴヴニュの肩飾り・重",
        "category": "肩",

        "base_effects": [
            { "type": "MaxHP", "value": 3472, "is_percent": false },
            { "type": "PVP物理ダメージ軽減", "value": 69, "is_percent": false }
        ],

        "enhance_effects_types": [
            "MaxHP",
            "PVP物理ダメージ軽減"
        ],

        "refine_effects_types": [
            "最終HP",
            "PVP最終物理ダメージ軽減"
        ],

        "effects_special": []
    },
    "item_shoes_gov_heavy": {
        "name": "ゴヴニュの軍靴・重",
        "category": "靴",

        "base_effects": [
            { "type": "MaxHP", "value": 5208, "is_percent": false },
            { "type": "PVP魔法ダメージ軽減", "value": 35, "is_percent": false }
        ],

        "enhance_effects_types": [
            "MaxHP",
            "PVP魔法ダメージ軽減"
        ],

        "refine_effects_types": [
            "最終HP",
            "PVP最終魔法ダメージ軽減"
        ],

        "effects_special": []
    },
    "item_armor_white_heavy": {
        "name": "ライフリンク",
        "category": "鎧_白",

        "base_effects": [
            { "type": "物理防御", "value": 122, "is_percent": false },
            { "type": "魔法防御", "value": 41, "is_percent": false }
        ],

        "enhance_effects_types": [
            "物理防御",
            "魔法防御"
        ],

        "refine_effects_types": [
            "最終物理防御",
            "最終魔法防御"
        ],

        "effects_special": []
    },
    "item_shoulder_white_heavy": {
        "name": "ウルフヘジン",
        "category": "肩_白",

        "base_effects": [
            { "type": "MaxHP", "value": 3472, "is_percent": false },
            { "type": "物理防御", "value": 69, "is_percent": false }
        ],

        "enhance_effects_types": [
            "MaxHP",
            "物理防御"
        ],

        "refine_effects_types": [
            "最終HP",
            "最終物理防御"
        ],

        "effects_special": []
    },
    "item_shoes_white_heavy": {
        "name": "バリアントシューズ",
        "category": "靴_白",

        "base_effects": [
            { "type": "MaxHP", "value": 5208, "is_percent": false },
            { "type": "魔法防御", "value": 35, "is_percent": false }
        ],

        "enhance_effects_types": [
            "MaxHP",
            "魔法防御"
        ],

        "refine_effects_types": [
            "最終HP",
            "最終魔法防御"
        ],

        "effects_special": []
    }



};
