// ==========================================================================
// 🛡️ 神紋（しんもん）分類・レアリティ別マスターデータベース
// ==========================================================================

const sinmonItemMaster = {
    "spear": {
        "name": "槍の神紋",
        "stats": {
            "animal_monster_dmg": {
                "label": "人間形モンスターダメージ増加",
                "is_percent": true,
                "values": { "white": 5.7, "blue": 11.5, "purple": 16.1, "orange": 23.0 }
            },
            "human_monster_res": {
                "label": "人間形モンスターダメージ軽減",
                "is_percent": true,
                "values": { "white": 5.7, "blue": 11.5, "purple": 16.1, "orange": 23.0 }
            }
        }
    },
    "hammer": {
        "name": "槌の神紋",
        "stats": {
            "fin_p_def": {
                "label": "最終物理防御",
                "is_percent": true,
                "values": { "white": 7.7, "blue": 15.3, "purple": 21.4, "orange": 30.6 }
            },
            "fin_m_def": {
                "label": "最終魔法防御",
                "is_percent": true,
                "values": { "white": 7.7, "blue": 15.3, "purple": 21.4, "orange": 30.6 }
            },
            "fin_p_pen": {
                "label": "最終物理貫通",
                "is_percent": true,
                "values": { "white": 4.6, "blue": 9.2, "purple": 12.9, "orange": 18.4 }
            },
            "fin_m_pen": {
                "label": "最終魔法貫通",
                "is_percent": true,
                "values": { "white": 4.6, "blue": 9.2, "purple": 12.9, "orange": 18.4 }
            },
            "cri_dmg_res": {
                "label": "CRIダメージ軽減",
                "is_percent": true,
                "values": { "white": 15.3, "blue": 30.6, "purple": 42.9, "orange": 61.3 }
            },
            "p_pen_fix": {
                "label": "物理貫通",
                "is_percent": false,
                "values": { "white": 230.0, "blue": 459.0, "purple": 643.0, "orange": 919.0 }
            },
            "m_pen_fix": {
                "label": "魔法貫通",
                "is_percent": false,
                "values": { "white": 230.0, "blue": 459.0, "purple": 643.0, "orange": 919.0 }
            },
            "cri_dmg_pct": {
                "label": "CRIダメージ",
                "is_percent": true,
                "values": { "white": 7.7, "blue": 15.3, "purple": 21.4, "orange": 30.6 }
            },
            "middle_monster_dmg": {
                "label": "中型モンスターダメージ増加",
                "is_percent": true,
                "values": { "white": 5.7, "blue": 11.5, "purple": 16.1, "orange": 23.0 }
            },
            "middle_monster_res": {
                "label": "中型モンスターダメージ軽減",
                "is_percent": true,
                "values": { "white": 5.7, "blue": 11.5, "purple": 16.1, "orange": 23.0 }
            },
            "attr_dmg_pct": {
                "label": "属性強化",
                "is_percent": true,
                "values": { "white": 4.6, "blue": 9.2, "purple": 12.9, "orange": 18.4 }
            }
        }
    },
    "sword": {
        "name": "剣の神紋",
        "stats": {
            "pvp_p_dmg_res": {
                "label": "PVP最終物理ダメージ軽減",
                "is_percent": true,
                "values": { "white": 7.7, "blue": 15.3, "purple": 21.4, "orange": 30.6 }
            },
            "pvp_m_dmg_res": {
                "label": "PVP最終魔法ダメージ軽減",
                "is_percent": true,
                "values": { "white": 7.7, "blue": 15.3, "purple": 21.4, "orange": 30.6 }
            },
            "pvp_debuff_res": {
                "label": "PVPデバフ軽減",
                "is_percent": true,
                "values": { "white": 7.7, "blue": 15.3, "purple": 21.4, "orange": 30.6 }
            },
            "pvp_debuff_tolerance": {
                "label": " PVPデバフ耐性",
                "is_percent": true,
                "values": { "white": 7.7, "blue": 15.3, "purple": 21.4, "orange": 30.6 }
            },
            "pvp_p_amp_fix": {
                "label": "PVP物理増強",
                "is_percent": false,
                "values": { "white": 230.0, "blue": 459.0, "purple": 643.0, "orange": 919.0 }
            },
            "pvp_m_amp_fix": {
                "label": "PVP魔法増強",
                "is_percent": false,
                "values": { "white": 230.0, "blue": 459.0, "purple": 643.0, "orange": 919.0 }
            },
            "pvp_p_amp_pct": {
                "label": "PVP最終物理増強",
                "is_percent": true,
                "values": { "white": 4.6, "blue": 9.2, "purple": 12.9, "orange": 18.4 }
            },
            "pvp_m_amp_pct": {
                "label": "PVP最終魔法増強",
                "is_percent": true,
                "values": { "white": 4.6, "blue": 9.2, "purple": 12.9, "orange": 18.4 }
            },
            "pvp_debuff_pen": {
                "label": "PVPデバフ貫通",
                "is_percent": true,
                "values": { "white": 7.7, "blue": 15.3, "purple": 21.4, "orange": 30.6 }
            },
            "pvp_debuff_amp": {
                "label": "PVPデバフ増強",
                "is_percent": true,
                "values": { "white": 7.7, "blue": 15.3, "purple": 21.4, "orange": 30.6 }
            }
        }
    },
    "chain": {
        "name": "鎖の神紋",
        "stats": {
            "animal_monster_dmg": {
                "label": "人間形モンスターダメージ増加",
                "is_percent": true,
                "values": { "white": 5.7, "blue": 11.5, "purple": 16.1, "orange": 23.0 }
            },
            "human_monster_res": {
                "label": "人間形モンスターダメージ軽減",
                "is_percent": true,
                "values": { "white": 5.7, "blue": 11.5, "purple": 16.1, "orange": 23.0 }
            }
        }
    },
    "halberd": {
        "name": "戟の神紋",
        "stats": {
            "fin_p_def": {
                "label": "最終物理防御",
                "is_percent": true,
                "values": { "white": 7.7, "blue": 15.3, "purple": 21.4, "orange": 30.6 }
            },
            "fin_m_def": {
                "label": "最終魔法防御",
                "is_percent": true,
                "values": { "white": 7.7, "blue": 15.3, "purple": 21.4, "orange": 30.6 }
            },
            "fin_p_pen": {
                "label": "最終物理貫通",
                "is_percent": true,
                "values": { "white": 4.6, "blue": 9.2, "purple": 12.9, "orange": 18.4 }
            },
            "fin_m_pen": {
                "label": "最終魔法貫通",
                "is_percent": true,
                "values": { "white": 4.6, "blue": 9.2, "purple": 12.9, "orange": 18.4 }
            },
            "cri_dmg_res": {
                "label": "CRIダメージ軽減",
                "is_percent": true,
                "values": { "white": 15.3, "blue": 30.6, "purple": 42.9, "orange": 61.3 }
            },
        "p_pen_fix": {
            "label": "物理貫通",
            "is_percent": false,
            "values": { "white": 230.0, "blue": 459.0, "purple": 643.0, "orange": 919.0 }
        },
        "m_pen_fix": {
            "label": "魔法貫通",
            "is_percent": false,
            "values": { "white": 230.0, "blue": 459.0, "purple": 643.0, "orange": 919.0 }
        },
        "hit_fix": {
            "label": "Hit",
            "is_percent": false,
            "values": { "white": 230.0, "blue": 459.0, "purple": 643.0, "orange": 919.0 }
        },
        "fin_cri_pct": {
            "label": "最終CRI",
            "is_percent": true,
            "values": { "white": 7.7, "blue": 15.3, "purple": 21.4, "orange": 30.6 }
        },
        "cri_fix": {
            "label": "CRI",
            "is_percent": false,
            "values": { "white": 230.0, "blue": 459.0, "purple": 643.0, "orange": 919.0 }
        },
        "cri_dmg_pct": {
            "label": "CRIダメージ",
            "is_percent": true,
            "values": { "white": 7.7, "blue": 15.3, "purple": 21.4, "orange": 30.6 }
        },
        "p_def_fix": {
            "label": "物理防御",
            "is_percent": false,
            "values": { "white": 230.0, "blue": 459.0, "purple": 643.0, "orange": 919.0 }
        },
        "m_def_fix": {
            "label": "魔法防御",
            "is_percent": false,
            "values": { "white": 230.0, "blue": 459.0, "purple": 643.0, "orange": 919.0 }
        },
        "fin_flee_pct": {
            "label": "最終Flee",
            "is_percent": true,
            "values": { "white": 7.7, "blue": 15.3, "purple": 21.4, "orange": 30.6 }
        },
        "flee_fix": {
            "label": "Flee",
            "is_percent": false,
            "values": { "white": 230.0, "blue": 459.0, "purple": 643.0, "orange": 919.0 }
        },
        "middle_monster_dmg": {
            "label": "中型モンスターダメージ増加",
            "is_percent": true,
            "values": { "white": 5.7, "blue": 11.5, "purple": 16.1, "orange": 23.0 }
        },
        "middle_monster_res": {
            "label": "中型モンスターダメージ軽減",
            "is_percent": true,
            "values": { "white": 5.7, "blue": 11.5, "purple": 16.1, "orange": 23.0 }
        },
        "attr_dmg_pct": {
            "label": "属性強化",
            "is_percent": true,
            "values": { "white": 4.6, "blue": 9.2, "purple": 12.9, "orange": 18.4 }
            }
        }
    }
};
