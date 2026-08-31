const slots = {
    oneHand: { id: "oneHand", apiKey: "片手武器" },
    subWeapon: { id: "subWeapon", apiKey: "サブ武器" },
    twoHand: { id: "twoHand", apiKey: "両手武器" },
    armor: { id: "armor", apiKey: "防具" },
    shoulder: { id: "shoulder", apiKey: "防具" },
    foot: { id: "foot", apiKey: "防具" },
    accLeft: { id: "accLeft", apiKey: "装飾" },
    accRight: { id: "accRight", apiKey: "装飾" },
    talisman: { id: "talisman", apiKey: "装飾" }
};

// ステータス名統合マッピング
const statAliasMap = {
    "最終HP2": "HP",
    "最終HP": "HP"
    // 今後増えたらここに追加
};

// ステータス名統合ヘルパー
function unifyStatName(name) {
    return statAliasMap[name] || name;
}

const subIndices = [1, 2, 3]; 
const levels = ["Lv16", "Lv17", "Lv18", "Lv19", "Lv20"];
const grades = ["白", "青", "紫", "橙"];

const cityOrder = ["フェイヨン", "ゲフェン", "アルデバラン", "コモド"];

let statusCityMap = {};

window.addEventListener('DOMContentLoaded', () => {
    if (typeof enchantMaster === 'undefined') {
        alert("データファイル(js/enchant_data.js)が見つかりません。");
        return;
    }
    buildStatusCityMap();
    initSimulator();
    updateSavedPlansDropdown_all();
    updateSavedDamagePlansDropdown();
    if (typeof calculateEquipmentTotalStatus === 'function') {
        calculateEquipmentTotalStatus();
    }
});

function buildStatusCityMap() {
    statusCityMap = {};
    for (let city in enchantMaster) {
        for (let apiKey in enchantMaster[city]) {
            if (!statusCityMap[apiKey]) {
                statusCityMap[apiKey] = {};
            }
            for (let statusName in enchantMaster[city][apiKey]) {
                statusCityMap[apiKey][statusName] = city;
            }
        }
    }
}

function initSimulator() {
    for (let key in slots) {
        const slot = slots[key];
        
        subIndices.forEach(num => {
            const lvlEl = document.getElementById(`level_${slot.id}_${num}`);
            if (lvlEl) lvlEl.innerHTML = levels.map(l => `<option value="${l}">${l}</option>`).join("");
            
            const grdEl = document.getElementById(`grade_${slot.id}_${num}`);
            if (grdEl) grdEl.innerHTML = grades.map(g => `<option value="${g}">${g}</option>`).join("");

            const statusSelect = document.getElementById(`status_${slot.id}_${num}`);
            if (statusSelect) {
                statusSelect.innerHTML = "<option value=''>選択してください</option>";

                const availableStatuses = statusCityMap[slot.apiKey];
                if (availableStatuses) {
                    const sortedStatuses = Object.keys(availableStatuses).sort((a, b) => {
                        const cityA = availableStatuses[a];
                        const cityB = availableStatuses[b];
                        const orderA = cityOrder.indexOf(cityA);
                        const orderB = cityOrder.indexOf(cityB);
                        
                        if (orderA !== orderB) return orderA - orderB;
                        return a.localeCompare(b);
                    });

                    sortedStatuses.forEach(statusName => {
                        const rawCity = availableStatuses[statusName];
                        const shortCity = rawCity.substring(0, 3); 

                        let opt = document.createElement("option");
                        opt.value = statusName;
                        opt.textContent = `${shortCity}：${statusName}`;
                        statusSelect.appendChild(opt);
                    });
                }
            }
        });
    }
    calculateAll();
}

// ⚔️ 武器スタイル切り替え ＆ 要素ダイレクトスキャン・双方向ポチ完全ミラーリング同期システム（ID重複バグ完全克服版）
function toggleWeaponMode(srcSide) {
    // 🌟【ID重複対策の核心】getElementByIdをやめ、CSSセレクタを使って「本物のラジオボタン」を構造から100%確実に捕まえます！
    const r1 = document.querySelector('input[name="weaponMode"][value="oneHand"]');
    const r3 = document.querySelector('input[name="weaponMode"][value="dualWield"]');
    const r2 = document.querySelector('input[name="weaponMode"][value="twoHand"]');

    const r1_eq = document.querySelector('input[name="weaponMode_eq_group"][value="oneHand"]');
    const r3_eq = document.querySelector('input[name="weaponMode_eq_group"][value="dualWield"]');
    const r2_eq = document.querySelector('input[name="weaponMode_eq_group"][value="twoHand"]');

    // デフォルトはエンチャント（メイン）側の状態をベースにします
    let isOneHand = r1?.checked || false;
    let isDualWield = r3?.checked || false;
    let isTwoHand = r2?.checked || false;

    // 操作されたのが「装備シミュレータ側（equipment）」だった場合は、装備側の checked 状態を最優先で上書き
    if (srcSide === 'equipment') {
        isOneHand = r1_eq?.checked || false;
        isDualWield = r3_eq?.checked || false;
        isTwoHand = r2_eq?.checked || false;
    }

    // 🌟 捕まえた「本物のラジオボタン要素」に対して、ダイレクトに見た目のチェック状態をミラーリング上書き！
    // これにより、画面内にどれだけIDの重複や残骸があろうとも、ブラウザは確実に本物のポチの色を100%パチッと切り替えてくれます！
    if (r1) r1.checked = isOneHand;
    if (r1_eq) r1_eq.checked = isOneHand;
    if (r3) r3.checked = isDualWield;
    if (r3_eq) r3_eq.checked = isDualWield;
    if (r2) r2.checked = isTwoHand;
    if (r2_eq) r2_eq.checked = isTwoHand;

    // 3. 💎【エンチャント画面側の有効・無効制御】
    subIndices.forEach(num => {
        const g1 = document.getElementById(`grade_oneHand_${num}`); if(g1) g1.disabled = isTwoHand;
        const l1 = document.getElementById(`level_oneHand_${num}`); if(l1) l1.disabled = isTwoHand;
        const s1 = document.getElementById(`status_oneHand_${num}`); if(s1) s1.disabled = isTwoHand;
        
        const g2 = document.getElementById(`grade_subWeapon_${num}`); if(g2) g2.disabled = isTwoHand;
        const l2 = document.getElementById(`level_subWeapon_${num}`); if(l2) l2.disabled = isTwoHand;
        const s2 = document.getElementById(`status_subWeapon_${num}`); if(s2) s2.disabled = isTwoHand;
        
        const g3 = document.getElementById(`grade_twoHand_${num}`); if(g3) g3.disabled = !isTwoHand;
        const l3 = document.getElementById(`level_twoHand_${num}`); if(l3) l3.disabled = !isTwoHand;
        const s3 = document.getElementById(`status_twoHand_${num}`); if(s3) s3.disabled = !isTwoHand;
    });

    for (let i = 1; i <= 3; i++) {
        const rowOne = document.getElementById(`row_oneHand_${i}`); if (rowOne) rowOne.classList.toggle("disabled-row", isTwoHand);
        const rowSub = document.getElementById(`row_subWeapon_${i}`); if (rowSub) rowSub.classList.toggle("disabled-row", isTwoHand);
        const rowTwo = document.getElementById(`row_twoHand_${i}`); if (rowTwo) rowTwo.classList.toggle("disabled-row", !isTwoHand);
    }

    const labelCell = document.getElementById("subWeaponLabelCell");
    if (labelCell) {
        if (isDualWield) {
            labelCell.textContent = "サブ片手武器";
            labelCell.style.color = "#dd6b20";
            labelCell.style.fontWeight = "bold";
        } else {
            labelCell.textContent = "サブ武器";
            labelCell.style.color = "";
            labelCell.style.fontWeight = "";
        }
    }

    subIndices.forEach(num => {
        const statusSelect = document.getElementById(`status_subWeapon_${num}`);
        if (!statusSelect) return;

        const currentSavedValue = statusSelect.value;
        statusSelect.innerHTML = "<option value=''>選択してください</option>";

        const apiKey = isDualWield ? "片手武器" : "サブ武器";
        const availableStatuses = statusCityMap[apiKey];

        if (availableStatuses) {
            const sortedStatuses = Object.keys(availableStatuses).sort((a, b) => {
                const cityA = availableStatuses[a];
                const cityB = availableStatuses[b];
                return cityOrder.indexOf(cityA) - cityOrder.indexOf(cityB) || a.localeCompare(b);
            });

            sortedStatuses.forEach(statusName => {
                const rawCity = availableStatuses[statusName];
                const shortCity = rawCity.substring(0, 3);
                let opt = document.createElement("option");
                opt.value = statusName;
                opt.textContent = `${shortCity}：${statusName}`;
                statusSelect.appendChild(opt);
            });
        }
        statusSelect.value = currentSavedValue;
    });

    // エンチャント側の再計算
    calculateAll();

    // 4. 🛡️【装備品シミュレータ画面側の再編成】
    if (typeof initEquipmentSimulator === 'function') {
        initEquipmentSimulator();
    }
    
    if (typeof calculateEquipmentTotalStatus === 'function') {
        calculateEquipmentTotalStatus();
    }
    
}

// 装備タブ側から変更が入った際の中継同期関数 (セレクタ連動を最優先させてバトンタッチ)
function syncWeaponModeFromEquipment(selectedMode) {
    // 💡 IDに頼らず、セレクタを使ってメイン側の本物のポチを確実に手動でONにします
    const r1 = document.querySelector('input[name="weaponMode"][value="oneHand"]');
    const r3 = document.querySelector('input[name="weaponMode"][value="dualWield"]');
    const r2 = document.querySelector('input[name="weaponMode"][value="twoHand"]');

    if (selectedMode === 'oneHand' && r1) r1.checked = true;
    if (selectedMode === 'dualWield' && r3) r3.checked = true;
    if (selectedMode === 'twoHand' && r2) r2.checked = true;
    
    // 操作元が装備側（'equipment'）であることを明示して、1回だけトグル関数を回します
    toggleWeaponMode('equipment');
}

function calculateAll() {
    const isOneHandMode = document.getElementById("weaponMode1").checked;
    const isDualWieldMode = document.getElementById("weaponMode3").checked;
    const isTwoHandMode = document.getElementById("weaponMode2").checked;
    
    const awakeLevelEl = document.getElementById("awakeningLevel");
    const awakeBonusRate = awakeLevelEl ? parseFloat(awakeLevelEl.value) : 0;
    const totalMultiplier = 1 + awakeBonusRate;

    let totals = {};

    for (let key in slots) {
        const slot = slots[key];

        if (slot.id === "twoHand" && !isTwoHandMode) {
            subIndices.forEach(num => {
                const el = document.getElementById(`result_${slot.id}_${num}`); if(el) el.textContent = "-";
            });
            continue;
        }
        if ((slot.id === "oneHand" || slot.id === "subWeapon") && isTwoHandMode) {
            subIndices.forEach(num => {
                const el = document.getElementById(`result_${slot.id}_${num}`); if(el) el.textContent = "-";
            });
            continue;
        }

        subIndices.forEach(num => {
            const resultEl = document.getElementById(`result_${slot.id}_${num}`);
            if (!resultEl) return;

            const gradeEl = document.getElementById(`grade_${slot.id}_${num}`);
            const levelEl = document.getElementById(`level_${slot.id}_${num}`);
            const statusEl = document.getElementById(`status_${slot.id}_${num}`);
            if (!gradeEl || !levelEl || !statusEl) return;

            const grade = gradeEl.value;
            const level = levelEl.value;
            const status = statusEl.value;

            if (!status) {
                resultEl.textContent = "-";
                return;
            }

            let targetApiKey = slot.apiKey;
            if (slot.id === "subWeapon" && isDualWieldMode) {
                targetApiKey = "片手武器";
            }

            const city = statusCityMap[targetApiKey]?.[status];
            if (!city) {
                resultEl.textContent = "エラー";
                return;
            }

            try {
                const val = enchantMaster[city][targetApiKey][status][level][grade];
                if (val !== undefined && val !== "") {
                    const isPercent = val.toString().includes('%');
                    const numValue = parseFloat(val.toString().replace('%', ''));

                    const singleAwakened = Math.round((numValue * totalMultiplier) * 100) / 100;
                    resultEl.textContent = `+${singleAwakened}${isPercent ? '%' : ''}`;

                    const intValue = Math.round(numValue * 100);

                    if (!totals[status]) {
                        totals[status] = { intValueSum: 0, isPercent: isPercent };
                    }
                    totals[status].intValueSum += intValue;

                } else {
                    resultEl.textContent = "なし";
                }
            } catch (e) {
                resultEl.textContent = "データ無";
            }
        });
    }

    let finalTotals = {};
    for (let statusName in totals) {
        const item = totals[statusName];
        const rawAwakenedValue = Math.round(item.intValueSum * totalMultiplier);
        const finalValue = Math.floor(rawAwakenedValue) / 100;

        finalTotals[statusName] = { value: finalValue, isPercent: item.isPercent };
    }

    updateTotalSummary(finalTotals);
}

function updateTotalSummary(totals) {
    const summaryDivBot = document.getElementById("totalSummary");
    const summaryDivTop = document.getElementById("totalSummary_top");

    if (Object.keys(totals).length === 0) {
        const noDataHtml = '<p class="no-data-text">装備のステータスを選択すると、ここに合計がリアルタイムで集計されます。</p>';
        if (summaryDivBot) summaryDivBot.innerHTML = noDataHtml;
        if (summaryDivTop) summaryDivTop.innerHTML = noDataHtml;
        return;
    }

    let cardHtml = "";
    for (let statusName in totals) {
        const item = totals[statusName];
        const finalValue = item.value;
        const unit = item.isPercent ? "%" : "";

        cardHtml += `
            <div class="summary-card">
                <div class="card-status-name">${statusName}</div>
                <div class="card-status-value">+${finalValue}${unit}</div>
            </div>
        `;
    }

    // 上部と下部の両方の総合計エリアにまったく同じカード群を同時に描画
    if (summaryDivBot) summaryDivBot.innerHTML = cardHtml;
    if (summaryDivTop) summaryDivTop.innerHTML = cardHtml;
}

function switchTab(tabName) {
    // 💡 1. 画面上のすべてのボタンIDと、対応するコンテンツ枠IDの設計図を定義
    const tabs = {
        'enchant':   { btnId: "tabBtnEnchant",   paneId: "tabContentEnchant" },
        'damage':    { btnId: "tabBtnDamage",    paneId: "tabContentDamage" },
        'equipment': { btnId: "tabBtnEquipment", paneId: "tabContentEquipment" },
        'etc':       { btnId: "tabBtnEtc",       paneId: "tabContentEtc" }
    };

    // 💡 2. すべてのタブ要素をループで回し、一度完全に「真っ新（非活性）」にする
    for (let key in tabs) {
        const btn = document.getElementById(tabs[key].btnId);
        const pane = document.getElementById(tabs[key].paneId);
        
        if (btn) btn.classList.remove("active-tab");
        if (pane) pane.classList.remove("active-pane");
    }

    // 💡 3. 🎭 今まさに選択されたタブ（tabName）に対応する要素だけをピンポイントで「活性化（表示）」
    // ※ ここで targetBtn や targetPane に正常に active クラスが付与されるため、これだけで開閉は完璧です！
    const activeTab = tabs[tabName];
    if (activeTab) {
        const targetBtn = document.getElementById(activeTab.btnId);
        const targetPane = document.getElementById(activeTab.paneId);
        
        if (targetBtn) targetBtn.classList.add("active-tab");
        if (targetPane) targetPane.classList.add("active-pane");
    }

    // 💡 4. 各タブ専用の初期化・再計算トリガーの安全連動
    if (tabName === 'equipment') {
        if (typeof initEquipmentSimulator === 'function') {
            initEquipmentSimulator();
        }
    } else if (tabName === 'etc') {
        if (typeof updateSavedOtherPlansDropdown === 'function') {
            updateSavedOtherPlansDropdown();
        }
        if (typeof calculateOtherTotalStatus === 'function') {
            calculateOtherTotalStatus();
        }
    } else if (tabName === 'damage') {
        // 🌟【バグ修正完了】エラーの元だった不整合な if (targetPane) の重複行を完全撤廃！
        // 👑【大トリのドッキング】ダメージ計算機タブが開かれた瞬間に、3大タブの合計を裏側で全自動合算します
        if (typeof calculateDamageTabTotalMerge === 'function') {
            calculateDamageTabTotalMerge();
        }
    }
}

function updateSavedPlansDropdown_all() {
    const selectTop = document.getElementById("savedPlansSelect_top");
    const selectBottom = document.getElementById("savedPlansSelect");
    const savedPlans = JSON.parse(localStorage.getItem("rox_enchant_plans")) || {};

    let html = '<option value="">-- プランを選択 --</option>';
    for (let planName in savedPlans) {
        html += `<option value="${planName}">${planName}</option>`;
    }
    if (selectTop) selectTop.innerHTML = html;
    if (selectBottom) selectBottom.innerHTML = html;
}

function syncSavePanelInputs(triggerSide) {
    const topInput = document.getElementById("planNameInput_top");
    const botInput = document.getElementById("planNameInput");
    if (!topInput || !botInput) return;
    if (triggerSide === 'top') botInput.value = topInput.value;
    else topInput.value = botInput.value;
}

function syncAwakeningLevel(triggerSide) {
    const topSelect = document.getElementById("awakeningLevel_top");
    const botSelect = document.getElementById("awakeningLevel");
    if (!topSelect || !botSelect) return;

    if (triggerSide === 'top') botSelect.value = topSelect.value;
    else topSelect.value = topSelect.value;
    calculateAll();
}

function saveCurrentPlan(side) {
    const suffix = side === 'top' ? '_top' : '';
    const planNameInput = document.getElementById(`planNameInput${suffix}`);
    const planName = planNameInput ? planNameInput.value.trim() : "";
    
    if (!planName) {
        alert("プラン名を入力してください。");
        return;
    }

    let planData = {
        isOneHand: document.getElementById("weaponMode1").checked,
        isDualWield: document.getElementById("weaponMode3").checked, // 🌟二刀流状態も安全に保存
        awakeningLevel: document.getElementById("awakeningLevel").value,
        selections: {}
    };

    for (let key in slots) {
        const id = slots[key].id;
        planData.selections[id] = {};
        subIndices.forEach(num => {
            planData.selections[id][num] = {
                grade: document.getElementById(`grade_${id}_${num}`).value,
                level: document.getElementById(`level_${id}_${num}`).value,
                status: document.getElementById(`status_${id}_${num}`).value
            };
        });
    }

    let savedPlans = JSON.parse(localStorage.getItem("rox_enchant_plans")) || {};
    savedPlans[planName] = planData;
    localStorage.setItem("rox_enchant_plans", JSON.stringify(savedPlans));
    
    const topInput = document.getElementById("planNameInput_top");
    const botInput = document.getElementById("planNameInput");
    if (topInput) topInput.value = "";
    if (botInput) botInput.value = "";

    alert(`プラン「${planName}」を保存しました！`);
    updateSavedPlansDropdown_all();
}

function loadSelectedPlan(side) {
    const suffix = side === 'top' ? '_top' : '';
    const selectEl = document.getElementById(`savedPlansSelect${suffix}`);
    if (!selectEl) return;
    const planName = selectEl.value;
    if (!planName) return;

    const otherSide = side === 'top' ? '' : '_top';
    const otherSelect = document.getElementById(`savedPlansSelect${otherSide}`);
    if (otherSelect) otherSelect.value = planName;

    const savedPlans = JSON.parse(localStorage.getItem("rox_enchant_plans")) || {};
    const plan = savedPlans[planName];
    if (!plan) return;

    // 🌟 過去データ(isDualWieldが未定義)の場合は通常の片手/両手を安全に判定(後方互換性)
    if (plan.isDualWield) {
        document.getElementById("weaponMode3").checked = true;
    } else if (plan.isOneHand) {
        document.getElementById("weaponMode1").checked = true;
    } else {
        document.getElementById("weaponMode2").checked = true;
    }
    
    toggleWeaponMode();

    if (document.getElementById("awakeningLevel_top")) document.getElementById("awakeningLevel_top").value = plan.awakeningLevel;
    if (document.getElementById("awakeningLevel")) document.getElementById("awakeningLevel").value = plan.awakeningLevel;

    for (let id in plan.selections) {
        subIndices.forEach(num => {
            const item = plan.selections[id][num];
            if (!item) return;
            const statusEl = document.getElementById(`status_${id}_${num}`); if (statusEl) statusEl.value = item.status || "";
            const lvlEl = document.getElementById(`level_${id}_${num}`); if (lvlEl) lvlEl.value = item.level || "Lv16";
            const grdEl = document.getElementById(`grade_${id}_${num}`); if (grdEl) grdEl.value = item.grade || "白";
        });
    }

    calculateAll();
}

function deleteSelectedPlan(side) {
    const suffix = side === 'top' ? '_top' : '';
    const selectEl = document.getElementById(`savedPlansSelect${suffix}`);
    const planName = selectEl ? selectEl.value : "";
    if (!planName) {
        alert("削除するプランを選択してください。");
        return;
    }

    if (confirm(`プラン「${planName}」を削除してもよろしいですか？`)) {
        let savedPlans = JSON.parse(localStorage.getItem("rox_enchant_plans")) || {};
        delete savedPlans[planName];
        localStorage.setItem("rox_enchant_plans", JSON.stringify(savedPlans));
        updateSavedPlansDropdown_all();
        calculateAll();
        alert("削除しました。");
    }
}

function applyBulkGrade() {
    const targetGrade = document.getElementById("bulkGrade").value;
    for (let key in slots) {
        const id = slots[key].id;
        subIndices.forEach(num => {
            const gradeEl = document.getElementById(`grade_${id}_${num}`);
            if (gradeEl) gradeEl.value = targetGrade;
        });
    }
    calculateAll();
}

function resetEnchantSimulator() {
    if (!confirm("現在選択している27マスのエンチャント構成をすべてリセットしますか？")) return;
    for (let key in slots) {
        const id = slots[key].id;
        subIndices.forEach(num => {
            const statusEl = document.getElementById(`status_${id}_${num}`); if (statusEl) statusEl.value = "";
            const lvlEl = document.getElementById(`level_${id}_${num}`); if (lvlEl) lvlEl.value = "Lv16";
            const grdEl = document.getElementById(`grade_${id}_${num}`); if (grdEl) grdEl.value = "白";
        });
    }
    if (document.getElementById("awakeningLevel_top")) document.getElementById("awakeningLevel_top").value = "0";
    if (document.getElementById("awakeningLevel")) document.getElementById("awakeningLevel").value = "0";
    calculateAll();
}

function applyBulkLevel() {
    const targetLevel = document.getElementById("bulkLevel").value;
    for (let key in slots) {
        const id = slots[key].id;
        subIndices.forEach(num => {
            const levelEl = document.getElementById(`level_${id}_${num}`);
            if (levelEl) levelEl.value = targetLevel;
        });
    }
    calculateAll();
}

// ==========================================================================
// 🛡️ ダメージ計算機 手動コントロール・相殺ロジック
// ==========================================================================

function switchPositionMode() {
    const modeEl = document.querySelector('input[name="calcPositionMode"]:checked');
    const isSrcMode = modeEl ? modeEl.value === "src" : true;

    const headerSrc = document.querySelector(".src-side-block h3") || document.querySelector(".text-pve");
    const headerDst = document.querySelector(".dst-side-block h3") || document.querySelector(".text-pvp");
    
    if (headerSrc && headerDst) {
        if (isSrcMode) {
            headerSrc.textContent = "🟥 攻撃側 / 増加部分 (あなた)";
            headerDst.textContent = "🟦 防御側 / 軽減部分 (ターゲット・敵)";
        } else {
            headerSrc.textContent = "🟥 攻撃側 / 増加部分 (仮想の敵・ボス)";
            headerDst.textContent = "🟦 防御側 / 軽減部分 (あなた)";
        }
    }
}

function calculateDamage() {
    const getValue = (id) => parseFloat(document.getElementById(id).value) || 0;

    const physicalAttack = getValue("calc_atk");                     
    const finalPhysicalPenetration = getValue("calc_pen");               
    const criticalDamage = getValue("calc_criDmg");         
    const physicalDamageBonus = getValue("calc_atkPercent"); 
    const finalPhysicalDamageBonus = getValue("calc_finAtkPercent"); 
    const raceBonus = getValue("calc_monsterDamage"); 
    const sizeEnhance = getValue("calc_sizeDamage"); 
    const finalDamageBonus = getValue("calc_finDmgUp");     
    const elementBonus = getValue("calc_attrDmg");       
    const elementCounter = getValue("calc_attrFactor"); 
    const sizeModifier = getValue("calc_sizeFactor");  
    const pvpPhysicalDamageBonus = getValue("calc_pvpAtkReal");       
    const pvpFinalPhysicalDamageBonus = getValue("calc_pvpAtkPercent"); 
    const skillMultiplier = getValue("calc_skillFactor"); 
    const skillAddition = getValue("calc_skillAdd");           
    const skillDamageBonus = getValue("calc_dmgUp"); 

    const targetFinalPhysicalDefense = getValue("calc_defPercent");               
    const targetCriticalDamageReduction = getValue("calc_criRes");         
    const targetPhysicalDamageReduction = getValue("calc_defRealPercent"); 
    const targetFinalPhysicalDamageReduction = getValue("calc_finAtkRes");    
    const targetRaceReduction = getValue("calc_monsterRes"); 
    const targetSizeReduction = getValue("calc_sizeRes");       
    const targetFinalDamageReduction = getValue("calc_finDmgRes"); 
    const targetElementResistance = getValue("calc_attrRes");       
    const targetPvpPhysicalDamageReduction = getValue("calc_pvpDefReal");       
    const targetPvpFinalPhysicalDamageReduction = getValue("calc_pvpDefPercent"); 

    let calcFinalPhysicalPenetration = finalPhysicalPenetration - targetFinalPhysicalDefense;
    if (calcFinalPhysicalPenetration < -80) { calcFinalPhysicalPenetration = -80; }

    let calcCriticalDamage = criticalDamage - targetCriticalDamageReduction;
    if (calcCriticalDamage < 20) { calcCriticalDamage = 20; }

    let calcFinalPhysicalDamageBonus = finalPhysicalDamageBonus - targetFinalPhysicalDamageReduction;
    if (calcFinalPhysicalDamageBonus < -80) { calcFinalPhysicalDamageBonus = -80; }

    let calcRaceBonus = raceBonus - targetRaceReduction;
    if (calcRaceBonus < -80) { calcRaceBonus = -80; }

    let calcElementEnhance = elementCounter + elementBonus - targetElementResistance;
    if (calcElementEnhance < 20) { calcElementEnhance = 20; }

    let calcSizeEnhance = sizeModifier + sizeEnhance - targetSizeReduction;
    if (calcSizeEnhance < 20) { calcSizeEnhance = 20; }

    let calcFinalDamageBonus = finalDamageBonus - targetFinalDamageReduction;
    if (calcFinalDamageBonus < -80) { calcFinalDamageBonus = -80; }

    let calcPvpFinalPhysicalDamageBonus = pvpFinalPhysicalDamageBonus - targetPvpFinalPhysicalDamageReduction;
    if (calcPvpFinalPhysicalDamageBonus < -80) { calcPvpFinalPhysicalDamageBonus = -80; }

    let physicalDamageMultiplier = (1 + calcFinalPhysicalDamageBonus / 100) * 
                                   (calcElementEnhance / 100) * 
                                   (1 + calcRaceBonus / 100) * 
                                   (1 + calcFinalDamageBonus / 100) * 
                                   (calcSizeEnhance / 100) * 
                                   (1 + skillDamageBonus / 100);

    const normalPhysicalDamage = Math.floor(physicalAttack * (1 + calcFinalPhysicalPenetration / 100) + (physicalDamageBonus - targetPhysicalDamageReduction)) * physicalDamageMultiplier;
    const criticalPhysicalDamage = Math.floor(physicalAttack * (calcCriticalDamage / 100) + (physicalDamageBonus - targetPhysicalDamageReduction)) * physicalDamageMultiplier;
    const normalSkillPhysicalDamage = Math.floor(((skillMultiplier / 100) * physicalAttack + skillAddition) * (1 + calcFinalPhysicalPenetration / 100) + (physicalDamageBonus - targetPhysicalDamageReduction)) * physicalDamageMultiplier;
    const criticalSkillPhysicalDamage = Math.floor(((skillMultiplier / 100) * physicalAttack + skillAddition) * (calcCriticalDamage / 100) + (physicalDamageBonus - targetPhysicalDamageReduction)) * physicalDamageMultiplier;

    let pvpNormalPhysicalDamageBase = (8 * (normalPhysicalDamage > 0 ? normalPhysicalDamage : 0) ** 0.6 + pvpPhysicalDamageBonus - targetPvpPhysicalDamageReduction);
    if (pvpNormalPhysicalDamageBase < 0) { pvpNormalPhysicalDamageBase = 0; }
    const pvpNormalPhysicalDamage = pvpNormalPhysicalDamageBase * (1 + calcPvpFinalPhysicalDamageBonus / 100);

    let pvpCriticalPhysicalDamageBase = (8 * (criticalPhysicalDamage > 0 ? criticalPhysicalDamage : 0) ** 0.6 + pvpPhysicalDamageBonus - targetPvpPhysicalDamageReduction);
    if (pvpCriticalPhysicalDamageBase < 0) { pvpCriticalPhysicalDamageBase = 0; }
    const pvpCriticalPhysicalDamage = pvpCriticalPhysicalDamageBase * (1 + calcPvpFinalPhysicalDamageBonus / 100);

    let pvpNormalSkillPhysicalDamageBase = (16 * (normalSkillPhysicalDamage > 0 ? normalSkillPhysicalDamage : 0) ** 0.6 + pvpPhysicalDamageBonus - targetPvpPhysicalDamageReduction);
    if (pvpNormalSkillPhysicalDamageBase < 0) { pvpNormalSkillPhysicalDamageBase = 0; }
    const pvpNormalSkillPhysicalDamage = pvpNormalSkillPhysicalDamageBase * (1 + calcPvpFinalPhysicalDamageBonus / 100);

    let pvpCriticalSkillPhysicalDamageBase = (16 * (criticalSkillPhysicalDamage > 0 ? criticalSkillPhysicalDamage : 0) ** 0.6 + pvpPhysicalDamageBonus - targetPvpPhysicalDamageReduction);
    if (pvpCriticalSkillPhysicalDamageBase < 0) { pvpCriticalSkillPhysicalDamageBase = 0; }
    const pvpCriticalSkillPhysicalDamage = pvpCriticalSkillPhysicalDamageBase * (1 + calcPvpFinalPhysicalDamageBonus / 100);

    // ==========================================
    // 📊 画面への最終出力処理
    // ==========================================
    const draw = (id, val) => {
        const el = document.getElementById(id);
        if (el) {
            const rounded = Math.floor(val);
            el.textContent = rounded > 0 ? rounded.toLocaleString() : "0";
        }
    };

    // PVE 結果の画面描画
    draw("out_monNorm", normalPhysicalDamage);
    draw("out_monCri", criticalPhysicalDamage);
    draw("out_monSkill", normalSkillPhysicalDamage);
    draw("out_monSkillCri", criticalSkillPhysicalDamage);

    // PVP 結果の画面描画
    draw("out_pvpNorm", pvpNormalPhysicalDamage);
    draw("out_pvpCri", pvpCriticalPhysicalDamage);
    draw("out_pvpSkill", pvpNormalSkillPhysicalDamage);
    draw("out_pvpSkillCri", pvpCriticalSkillPhysicalDamage);
}

function updateSavedDamagePlansDropdown() {
    const select = document.getElementById("savedDmgPlansSelect"); if (!select) return;
    select.innerHTML = '<option value="">-- プランを選択 --</option>';
    const savedDmgPlans = JSON.parse(localStorage.getItem("rox_damage_plans")) || {};
    for (let planName in savedDmgPlans) {
        let opt = document.createElement("option"); opt.value = planName; opt.textContent = planName; select.appendChild(opt);
    }
}

function saveDamagePlan() {
    const planNameInput = document.getElementById("dmgPlanNameInput");
    const planName = planNameInput ? planNameInput.value.trim() : "";
    if (!planName) { alert("計算プラン名を入力してください。"); return; }
    const modeEl = document.querySelector('input[name="calcPositionMode"]:checked');
    let damagePlanData = { positionMode: modeEl ? modeEl.value : "src", inputs: {} };
    const inputIds = [
        "calc_atk", "calc_pen", "calc_criDmg", "calc_atkPercent", "calc_finAtkPercent", "calc_monsterDamage",
        "calc_attrDmg", "calc_attrFactor", "calc_sizeFactor", "calc_sizeDamage", "calc_dmgUp", "calc_finDmgUp",
        "calc_pvpAtkReal", "calc_pvpAtkPercent", "calc_skillFactor", "calc_skillAdd", "calc_defPercent", "calc_criRes",
        "calc_defRealPercent", "calc_finAtkRes", "calc_monsterRes", "calc_attrRes", "calc_sizeRes", "calc_finDmgRes",
        "calc_pvpDefReal", "calc_pvpDefPercent"
    ];
    inputIds.forEach(id => {
        const el = document.getElementById(id); if (el) damagePlanData.inputs[id] = el.value;
    });
    let savedDmgPlans = JSON.parse(localStorage.getItem("rox_damage_plans")) || {};
    savedDmgPlans[planName] = damagePlanData;
    localStorage.setItem("rox_damage_plans", JSON.stringify(savedDmgPlans));
    if (planNameInput) planNameInput.value = "";
    alert(`計算プラン「${planName}」を保存しました！`);
    updateSavedDamagePlansDropdown();
}

function loadDamagePlan() {
    const planName = document.getElementById("savedDmgPlansSelect").value; if (!planName) return;
    const savedDmgPlans = JSON.parse(localStorage.getItem("rox_damage_plans")) || {};
    const plan = savedDmgPlans[planName]; if (!plan) return;
    if (plan.positionMode === "src") document.getElementById("calcModeSrc").checked = true;
    else document.getElementById("calcModeDst").checked = true;
    switchPositionMode();
    for (let id in plan.inputs) {
        const el = document.getElementById(id); if (el) el.value = plan.inputs[id];
    }
    calculateDamage();
}

function deleteDamagePlan() {
    const select = document.getElementById("savedDmgPlansSelect"); const planName = select ? select.value : "";
    if (!planName) { alert("削除する計算プランを選択してください。"); return; }
    if (confirm(`計算プラン「${planName}」を削除してもよろしいですか？`)) {
        let savedDmgPlans = JSON.parse(localStorage.getItem("rox_damage_plans")) || {}; delete savedDmgPlans[planName];
        localStorage.setItem("rox_damage_plans", JSON.stringify(savedDmgPlans)); updateSavedDamagePlansDropdown(); calculateDamage(); alert("削除しました。");
    }
}

function filterNumberInput(event) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '.', '-'];
    if (allowedKeys.includes(event.key) || (event.key >= '0' && event.key <= '9')) return true;
    event.preventDefault(); return false;
}

// ==========================================================================
// 🛡️ 装備シミュレータシステム（6項目フルスペック対応・次世代拡張型）
// ==========================================================================

// 1. 各装備部位（HTML側のキー名）と、データファイル側の「slot（装着部位）」のマッピング対応表
const equipmentSlotMapping = {
    oneHand: "武器",
    subWeapon: "サブ武器",
    shield: "盾",
    twoHand: "武器", 
    armor: "鎧",
    shoulder: "肩",
    foot: "靴",
    accLeft: "装飾(アクセ/お守り)",
    accRight: "装飾(アクセ/お守り)",
    talisman: "装飾(アクセ/お守り)"
};

// 2. 現在のユーザーの装備・カード装着状態を記憶するメモリ用オブジェクト
let currentEquippedItems = {}; // 例: {"oneHand_equip": "item_id", "oneHand_card1": "card_307", ...}
let currentSelectedTargetField = null; // 現在どのマスの項目を選択しているか (例: "oneHand_card1" や "armor_equip")

// 既存のタブ切り替え（switchTab）の機能を拡張ドッキング
const originalSwitchTab = switchTab;
switchTab = function(tabName) {
    if (typeof originalSwitchTab === 'function') {
        originalSwitchTab(tabName);
    }
    
    const btnEquipment = document.getElementById("tabBtnEquipment");
    const contentEquipment = document.getElementById("tabContentEquipment");
    
    if (btnEquipment && contentEquipment) {
        if (tabName === 'equipment') {
            btnEquipment.classList.add("active-tab");
            contentEquipment.classList.add("active-pane");
            // 起動・切り替え時にスロットを自動生成
            initEquipmentSimulator();
        } else {
            btnEquipment.classList.remove("active-tab");
            contentEquipment.classList.remove("active-pane");
        }
    }
};

// 装備シミュレータの初期化
// ⚠️ js/script.js 内の既存の「function initEquipmentSimulator() { ... }」をこの【装備・カード完全維持版】に丸ごと置き換えてください

function initEquipmentSimulator() {
    const tbody = document.getElementById("equipmentSlotTableBody");
    if (!tbody) return;

    // 現在の武器スタイルのチェック状態を正確に取得
    const isOneHandMode = document.getElementById("weaponMode1")?.checked || document.getElementById("weaponMode1_eq")?.checked || false;
    const isDualWieldMode = document.getElementById("weaponMode3")?.checked || document.getElementById("weaponMode3_eq")?.checked || false;
    const isTwoHandMode = document.getElementById("weaponMode2")?.checked || document.getElementById("weaponMode2_eq")?.checked || false;

    // 🌟【新設：武器スタイル変更時の装備・カードメモリ自動クレンジングガード】
    // スタイル変更によって画面から物理的に消える武器枠の装備とカードだけを安全に整理し、
    // 防具（鎧・肩・足）や装飾品（アクセ・お守り）のメモリは1文字も触らずに100%完全に維持します！
    if (typeof currentEquippedItems !== 'undefined') {
        if (isTwoHandMode) {
            // 両手武器になったなら、片手武器とサブ武器の装備・カードをメモリから安全に消去
            delete currentEquippedItems["oneHand_equip"];
            delete currentEquippedItems["subWeapon_equip"];
            for (let num = 1; num <= 5; num++) {
                delete currentEquippedItems[`oneHand_card_${num}`];
                delete currentEquippedItems[`subWeapon_card_${num}`];
            }
        } else {
            // 片手武器または二刀流になったなら、両手武器の装備・カードをメモリから安全に消去
            delete currentEquippedItems["twoHand_equip"];
            for (let num = 1; num <= 5; num++) {
                delete currentEquippedItems[`twoHand_card_${num}`];
            }
        }
    }

    // 🌟【数値の一時退避・引き継ぎロジック】
    // テーブルを消去する前に、現在画面の各マスに入力されている精錬値と強化値をメモリへ記憶
    let tempSavedValues = {};
    const allSlotIds = ["oneHand", "subWeapon", "twoHand", "armor", "shoulder", "foot", "accLeft", "accRight", "talisman", "head", "face", "mouth", "costume", "back", "tail"];
    
    allSlotIds.forEach(slotId => {
        const refineEl = document.getElementById(`refine_${slotId}`);
        const enhanceEl = document.getElementById(`enhance_${slotId}`);
        
        tempSavedValues[slotId] = {
            refine: refineEl ? refineEl.value : "0",
            enhance: enhanceEl ? enhanceEl.value : "100" // デフォルト初期値は100
        };
    });

    // 毎回一度完全に空っぽにして、現在の武器スタイルに合わせて再構築
    tbody.innerHTML = ""; 

    // 武器スタイルに応じて出現させるべき部位とスロット数を定義
    let weaponItems = [];
    if (isTwoHandMode) {
        weaponItems = [{ id: "twoHand", name: "両手武器", slots: 5, hasStats: true }];
    } else if (isDualWieldMode) {
        weaponItems = [
            { id: "oneHand", name: "片手武器", slots: 3, hasStats: true },
            { id: "subWeapon", name: "サブ片手武器", slots: 3, hasStats: true }
        ];
    } else {
        weaponItems = [
            { id: "oneHand", name: "片手武器", slots: 3, hasStats: true },
            { id: "subWeapon", name: "サブ武器", slots: 2, hasStats: true }
        ];
    }

    // 全装備分類・全部位の設計図
    const equipmentStructure = [
        { category: "武器", items: weaponItems },
        {
            category: "防具",
            items: [
                { id: "armor", name: "鎧", slots: 2, hasStats: true },
                { id: "shoulder", name: "肩", slots: 2, hasStats: true },
                { id: "foot", name: "靴", slots: 2, hasStats: true }
            ]
        },
        {
            category: "装飾",
            items: [
                { id: "accLeft", name: "装飾(左)", slots: 2, hasStats: true },
                { id: "accRight", name: "装飾(右)", slots: 2, hasStats: true },
                { id: "talisman", name: "お守り", slots: 2, hasStats: true }
            ]
        },
        {
            category: "衣装",
            items: [
                { id: "head", name: "頭", slots: 2, hasStats: false },
                { id: "face", name: "顔", slots: 2, hasStats: false },
                { id: "mouth", name: "口", slots: 2, hasStats: false },
                { id: "costume", name: "服装", slots: 1, hasStats: false },
                { id: "back", name: "背中", slots: 1, hasStats: false },
                { id: "tail", name: "尻尾", slots: 1, hasStats: false }
            ]
        }
    ];

    let html = "";

    equipmentStructure.forEach(catBlock => {
        let activeItemCount = catBlock.items.length;
        let isFirstItemInCategory = true;

        catBlock.items.forEach(item => {
            html += `<tr>`;

            if (isFirstItemInCategory) {
                html += `<td rowspan="${activeItemCount}" class="cat-header" style="font-weight:bold; background:#f7fafc; text-align:center; vertical-align:middle; border-right:2px solid #cbd5e0;">${catBlock.category}</td>`;
                isFirstItemInCategory = false;
            }

            html += `<td style="font-weight:bold; background:#fafafa; vertical-align:middle; white-space:nowrap;">${item.name}</td>`;

            // 避難させていた過去の数値をここで安全に読み出し
            const savedRefine = tempSavedValues[item.id]?.refine || "0";
            const savedEnhance = tempSavedValues[item.id]?.enhance || "100";

            html += `
                <td id="cell_equip_${item.id}" onclick="selectEquipmentComponent('${item.id}', 'equip')" style="vertical-align:middle; padding: 6px 8px;">
                    <div class="eq-item-text-container">
                        <div id="display_equip_${item.id}" class="eq-item-display-name">未装着 (選択)</div>
                        <button class="eq-equip-remove-btn" onclick="unequipItemField(event, '${item.id}')">×</button>
                    </div>
                </td>
                <td style="vertical-align:middle; text-align:center;">
                    ${item.hasStats ? `
                        <select id="refine_${item.id}" onchange="calculateEquipmentTotalStatus()" style="padding:4px; font-size:12px; width:58px;">
                            <option value="0" ${savedRefine==="0"?'selected':''}>+0</option>
                            <option value="1" ${savedRefine==="1"?'selected':''}>+1</option>
                            <option value="2" ${savedRefine==="2"?'selected':''}>+2</option>
                            <option value="3" ${savedRefine==="3"?'selected':''}>+3</option>
                            <option value="4" ${savedRefine==="4"?'selected':''}>+4</option>
                            <option value="5" ${savedRefine==="5"?'selected':''}>+5</option>
                            <option value="6" ${savedRefine==="6"?'selected':''}>+6</option>
                            <option value="7" ${savedRefine==="7"?'selected':''}>+7</option>
                            <option value="8" ${savedRefine==="8"?'selected':''}>+8</option>
                            <option value="9" ${savedRefine==="9"?'selected':''}>+9</option>
                            <option value="10" ${savedRefine==="10"?'selected':''}>+10</option>
                            <option value="11" ${savedRefine==="11"?'selected':''}>+11</option>
                            <option value="12" ${savedRefine==="12"?'selected':''}>+12</option>
                            <option value="13" ${savedRefine==="13"?'selected':''}>+13</option>
                            <option value="14" ${savedRefine==="14"?'selected':''}>+14</option>
                            <option value="15" ${savedRefine==="15"?'selected':''}>+15</option>
                        </select>
                    ` : `<span style="color:#a0aec0; font-size:11px;">-</span>`}
                </td>
                <td style="vertical-align:middle; text-align:center;">
                    ${item.hasStats ? `
                        <input type="number" id="enhance_${item.id}" value="${savedEnhance}" min="100" max="120" 
                               oninput="calculateEquipmentTotalStatus()" 
                               onkeydown="return filterNumberInput(event)" 
                               style="width:50px; padding:4px; font-size:12px; text-align:center; box-sizing:border-box;">
                    ` : `<span style="color:#a0aec0; font-size:11px;">-</span>`}
                </td>
            `;

            let cardsContainerHtml = `<td style="vertical-align:middle; padding: 6px 4px;"><div class="eq-card-horizontal-flex">`;
            
            for (let num = 1; num <= item.slots; num++) {
                const slotUniqueKey = `${item.id}_${num}`;
                
                const isEliteSlotNum = (item.slots >= 2 && num === item.slots);
                
                cardsContainerHtml += `
                    <!-- 💡 isEliteSlotNum が true の時だけ、末尾に「is-elite-slot」クラスを美しく付与します！ -->
                    <div id="cell_card_${slotUniqueKey}" class="eq-mini-card-slot ${isEliteSlotNum ? 'is-elite-slot' : ''}" onclick="selectEquipmentComponent('${item.id}', 'card_${num}')">
                        <div class="mini-card-text-wrapper">
                            <span id="display_card_${slotUniqueKey}" class="mini-card-display-name">空き枠</span>
                        </div>
                        <button class="mini-card-remove-btn" onclick="unequipItem(event, '${item.id}', ${num})">×</button>
                    </div>
                `;
            }
            
            cardsContainerHtml += `</div></td>`;
            html += cardsContainerHtml;

            html += `</tr>`;
        });
    });

    tbody.innerHTML = html;

    equipmentSlotMapping.head = "衣装";
    equipmentSlotMapping.face = "衣装";
    equipmentSlotMapping.mouth = "衣装";
    equipmentSlotMapping.costume = "服装"; 
    equipmentSlotMapping.back = "背中";    
    equipmentSlotMapping.tail = "尻尾";    

    if (typeof currentEquippedItems !== 'undefined') {
        for (let key in currentEquippedItems) {
            const itemId = currentEquippedItems[key];
            if (!itemId) continue;

            if (key.includes("_equip")) {
                // 1. 装備品名の復元描画
                const slotId = key.replace("_equip", "");
                const displayEl = document.getElementById(`display_equip_${slotId}`);
                if (displayEl && typeof equipmentItemMaster !== 'undefined' && equipmentItemMaster[itemId]) {
                    displayEl.textContent = equipmentItemMaster[itemId].name;
                    displayEl.style.color = "#2b6cb0";
                    displayEl.style.fontWeight = "bold";
                }
            } else if (key.includes("_card_")) {
                // メモリキー（例: armor_card_1）を、HTML側のID（例: display_card_armor_1）の形式へ完璧に変換します！
                const correctHtmlSlotId = key.replace("_card_", "_"); // "armor_card_1" ➔ "armor_1"
                
                const displayEl = document.getElementById(`display_card_${correctHtmlSlotId}`);
                
                // お使いのカードデータマスタの変数名を安全にスキャン
                const currentCardMaster = (typeof cardMaster !== 'undefined') ? cardMaster : (typeof cardtMaster !== 'undefined' ? cardtMaster : undefined);
                
                if (displayEl && currentCardMaster && currentCardMaster[itemId]) {
                    const rawCardName = currentCardMaster[itemId].name;
                    // カード名をスマートな4文字カプセル表示に成型
                    const truncatedName = rawCardName.length > 4 ? rawCardName.substring(0, 4) + "…" : rawCardName;
                    displayEl.textContent = truncatedName;
                    displayEl.style.color = "#2b6cb0";
                    
                }
            }
        }
    }
}

// ==========================================================================
// 🛡️ 装備品本体（アイテム）専用の取り外しリセット関数 (精錬・強化値キープ版)
// ==========================================================================
function unequipItemField(event, slotId) {
    event.stopPropagation(); // 行のクリックイベント発動を防止する安全ガード
    
    // 1. 装備品用メモリキー（例: "accLeft_equip"）を作成してデータを消去
    const targetKey = `${slotId}_equip`;
    delete currentEquippedItems[targetKey];
    
    // 2. 画面上の表示を初期状態の「未装着 (選択)」のグレー文字に綺麗に差し戻す
    const displayId = `display_equip_${slotId}`;
    const displayEl = document.getElementById(displayId);
    if (displayEl) {
        displayEl.textContent = "未装着 (選択)";
        displayEl.style.color = "#718096";
        displayEl.style.fontWeight = "normal";
        displayEl.title = "";
    }
    
    // 💡 精錬プルダウン・強化入力欄の数値はそのまま100%その場に維持されます
    
    // 3. リアルタイムに上部総合計ボードを再計算
    calculateEquipmentTotalStatus();
}

// ==========================================================================
// 🛡️ 装備品一括コントロールパネル用：実行関数
// ==========================================================================
function applyBulkRefine() {
    const targetRefine = document.getElementById("bulkRefine").value;
    for (let key in slots) {
        const slotId = slots[key].id;
        const refineEl = document.getElementById(`refine_${slotId}`);
        if (refineEl) {
            refineEl.value = targetRefine;
        }
    }
    calculateEquipmentTotalStatus();
}

function applyBulkEnhance() {
    let targetEnhance = parseInt(document.getElementById("bulkEnhance").value) || 100;
    
    // 手動で変な数字を打たれた場合も、100未満なら100、120超なら120に安全ガード
    if (targetEnhance < 100) targetEnhance = 100;
    if (targetEnhance > 120) targetEnhance = 120;
    document.getElementById("bulkEnhance").value = targetEnhance;

    for (let key in slots) {
        const slotId = slots[key].id;
        const enhanceEl = document.getElementById(`enhance_${slotId}`);
        if (enhanceEl) {
            enhanceEl.value = targetEnhance;
        }
    }
    calculateEquipmentTotalStatus();
}

// 🟦 右側のリストを条件（部位連動 ＋ A/B面判定 ＋ 検索フィルタ）に合わせて動的に描画する
function renderEquipmentMasterList() {
    const container = document.getElementById("equipmentMasterListContainer");
    if (!container) return;
    
    container.innerHTML = "";

    let filterSlotName = null;
    let isEquipSearching = false;
    let specificCategoryFilter = null; // 🌟「アクセ」か「お守り」かをピンポイントで記憶する用の変数

    if (currentSelectedTargetField) {
        const parts = currentSelectedTargetField.split("_");
        const slotId = parts[0];          
        const componentType = parts[1];   

        isEquipSearching = (componentType === 'equip');

        const isDualWieldMode = document.getElementById("weaponMode3")?.checked;
        const isTwoHandMode = document.getElementById("weaponMode2")?.checked;

        // --- 装備検索時 ---
        if (isEquipSearching) {

            // ⭐ 武器系スロットのカテゴリ分岐
            if (slotId === "oneHand") {
                filterSlotName = isDualWieldMode ? "短剣" :"片手武器";
            }
            else if (slotId === "twoHand") {
                filterSlotName = "両手武器";
            }
            else if (slotId === "subWeapon") {
                filterSlotName = isDualWieldMode ? "短剣" : "盾";
            }
            else {
                // 通常スロット
                filterSlotName = equipmentSlotMapping[slotId];
            }
        }

        // --- カード検索時 ---
        else {

            // ⭐ 武器系スロットのカテゴリ分岐（カード側）
            if (slotId === "oneHand") {
                filterSlotName = "武器";
            }
            else if (slotId === "twoHand") {
                filterSlotName = "武器";
            }
            else if (slotId === "subWeapon") {
                filterSlotName = "武器";;
            }
            else {
                filterSlotName = equipmentSlotMapping[slotId];
            }
        }

        // --- 特殊カテゴリフィルタ ---
        if (slotId === "accLeft" || slotId === "accRight") {
            specificCategoryFilter = "アクセ";
        } 
        else if (slotId === "talisman") {
            specificCategoryFilter = "お守り";
        }
        else if (slotId === "subWeapon") {
            specificCategoryFilter = isDualWieldMode ? "短剣" : "盾";
        }
    }

    const nameSearchWord = document.getElementById("equipmentSearchNameInput") ? document.getElementById("equipmentSearchNameInput").value.trim() : "";
    const effectSearchWord = document.getElementById("equipmentSearchEffectInput") ? document.getElementById("equipmentSearchEffectInput").value.trim() : "";

    // ----------------====================================
    // 🌟【A面】装備品マスタからの検索・描画（「装備品」選択マスの時）
    // --------------------------------====================
    if (isEquipSearching) {
        if (typeof equipmentItemMaster === 'undefined') {
            container.innerHTML = '<p class="no-data-text" style="padding:20px; text-align:center; color:#e53e3e;">エラー: equipmentItemMaster が読み込めていません。</p>';
            return;
        }
        
        for (let itemId in equipmentItemMaster) {
            const item = equipmentItemMaster[itemId];
            
            // 🟥 1. 部位連動フィルタ
            const shortCategory = item.category.split("_")[0]; // 「アクセ」または「お守り」を取り出す

            // 💡【ココが分離の核心】
            // もし「アクセ」のマスを押しているのにアイテムが「お守り」だったらスキップ（逆も然り）
            if (specificCategoryFilter && shortCategory !== specificCategoryFilter) {
                continue;
            }

            // 通常の武器や防具の部位連動（filterSlotNameの中にカテゴリが含まれているか）
            if (!specificCategoryFilter && filterSlotName && !filterSlotName.includes(shortCategory)) {
                continue;
            }

            // 🟥 2. 名前検索フィルタ
            if (nameSearchWord && !item.name.includes(nameSearchWord)) {
                continue;
            }

            // 🟥 3. 効果テキスト検索フィルタ
            let baseText = item.base_effects.map(e => `${e.type}+${e.value}${e.is_percent ? '%' : ''}`).join(", ");
            if (effectSearchWord && !baseText.includes(effectSearchWord)) {
                continue;
            }

            let itemPanel = document.createElement("div");
            itemPanel.className = "equipment-item-render-panel";
            itemPanel.onclick = () => equipItemToCurrentSlot(itemId);
            
            itemPanel.innerHTML = `
                <div class="equipment-render-info-left">
                    <span class="equipment-render-name">🛡️ ${item.name}</span>
                    <span class="equipment-render-slot-tag" style="background:#e3f2fd; color:#0d47a1;">${shortCategory}</span>
                    <span class="equipment-render-effects-text">初期値: ${baseText}</span>
                </div>
                <div style="font-size: 11px; font-weight: bold; color: #2b6cb0;">装備 ➔</div>
            `;
            container.appendChild(itemPanel);
        }
    } 
    
    // ----------------====================================
    // 🌟【B面】カードマスタからの検索・描画（「カード枠」選択マスの時）
    // --------------------------------====================
    else {
        if (typeof cardMaster === 'undefined') return;
        
        for (let itemId in cardMaster) {
            const item = cardMaster[itemId];

            if (filterSlotName && item.slot !== filterSlotName) {
                continue;
            }

            // 🌟【1288行目エラー完全修正：forループの内側に鉄壁のガードを配置！】
            if (currentSelectedTargetField) {
                const parts = currentSelectedTargetField.split("_");
                const slotId = parts[0];          // 例: "oneHand", "armor"
                const componentType = parts[1];   // 例: "card"
                const currentCardNum = parseInt(parts[2]) || 0; // 何番目のカード枠か(1〜5)

                // 画面上の現在の装備品情報から、その部位の「本物の最大スロット数」を全自動で逆算！
                let maxSlotsForThisItem = 2; // デフォルトは防具・アクセの2枠
                if (slotId === "oneHand") maxSlotsForThisItem = 3;  // 片手武器は3枠
                if (slotId === "twoHand") maxSlotsForThisItem = 5;  // 両手武器は5枠
                if (slotId === "subWeapon") {
                    const isDual = document.getElementById("weaponMode3")?.checked || document.getElementById("weaponMode3_eq")?.checked || false;
                    maxSlotsForThisItem = isDual ? 3 : 2; // 二刀流なら3枠、盾なら2枠
                }
                if (slotId === "costume" || slotId === "back" || slotId === "tail") maxSlotsForThisItem = 1; // 1枠部位

                // 最大2マス以上ある部位の「一番最後のスロット（黄色枠）」だった場合
                if (maxSlotsForThisItem >= 2 && currentCardNum === maxSlotsForThisItem) {
                    // 🚨 エリート専用枠なので、is_elite フラグが true ではない通常カードは100%強制非表示！
                    // 💡 ループの内側に正しく配置されたため、この continue は100%安全に作動します！
                    if (!item.is_elite) {
                        continue;
                    }
                }
            }

            if (nameSearchWord && !item.name.includes(nameSearchWord)) {
                continue;
            }

            let effectsText = item.effects.map(eff => `${eff.type}+${eff.value}${eff.is_percent ? '%' : ''}`).join(", ");
            if (effectSearchWord && !effectsText.includes(effectSearchWord)) {
                continue;
            }

            let itemPanel = document.createElement("div");
            itemPanel.className = "equipment-item-render-panel";
            itemPanel.onclick = () => equipItemToCurrentSlot(itemId);
            
            itemPanel.innerHTML = `
                <div class="equipment-render-info-left">
                    <span class="equipment-render-name">🃏 ${item.name}</span>
                    <span class="equipment-render-slot-tag">${item.slot}</span>
                    <span class="equipment-render-effects-text">${effectsText}</span>
                </div>
                <div style="font-size: 11px; font-weight: bold; color: #3182ce;">装着 ➔</div>
            `;
            container.appendChild(itemPanel);
        }
    }

    if (container.children.length === 0) {
        container.innerHTML = '<p class="no-data-text" style="padding:20px; text-align:center; color:#718096;">条件に一致するアイテム/カードが見つかりません。</p>';
    }
}

// 各マス（装備品やカード1〜3）がクリックされた時の制御関数
function selectEquipmentComponent(slotId, componentType) {
    // 現在どの部位の、どの項目を選んでいるかを一意のキーとして記憶
    currentSelectedTargetField = `${slotId}_${componentType}`;
    
    // 全てのマスの選択ハイライト効果（背景色など）を一度リセット
    document.querySelectorAll("#equipmentSlotTableBody td").forEach(td => {
        td.style.backgroundColor = "";
        td.style.border = "";
    });
    
    // クリックされた特定のマス（セル）だけをオレンジ色に美しくハイライト
    const clickedCell = document.getElementById(`cell_${componentType}_${slotId}`);
    if (clickedCell) {
        clickedCell.style.backgroundColor = "#fff3e0";
        clickedCell.style.border = "1px solid #ed8936";
    }

    // 右側ヘッダーの選択中の部位バッジテキストを動的に変更
    const badge = document.getElementById("currentSelectedEquipmentSlotBadge");
    if (badge) {
        const targetSlotName = equipmentSlotMapping[slotId] || "不明";
        let labelName = componentType === 'equip' ? "装備品" : `カード枠 ${componentType.replace('card', '')}`;
        badge.textContent = `${targetSlotName} [${labelName}]`;
    }

    // 連動させて右側のリストを再描画（componentTypeを判定して一覧の中身をスイッチ可能）
    renderEquipmentMasterList();
}

// 検索窓の高速更新トリガー
function filterEquipmentListDisplay() {
    renderEquipmentMasterList();
}

// 検索リセット
function clearEquipmentFilters() {
    if (document.getElementById("equipmentSearchNameInput")) document.getElementById("equipmentSearchNameInput").value = "";
    if (document.getElementById("equipmentSearchEffectInput")) document.getElementById("equipmentSearchEffectInput").value = "";
    renderEquipmentMasterList();
}

// 右側でアイテム/カードが選ばれたら、現在選択中のマスへピンポイントで装着
function equipItemToCurrentSlot(itemId) {
    if (!currentSelectedTargetField) {
        alert("先に左側の各マスの選択欄（装備品やカード枠など）をクリックしてください。");
        return;
    }

    // 現在選んでいるマスのID文字列（例: "accLeft_equip" や "talisman_card_1"）を綺麗に分解
    const parts = currentSelectedTargetField.split("_");
    const slotId = parts[0];          // 例: "accLeft", "talisman"
    const componentType = parts[1];   // 💡 ココが "equip" なら装備品、"card" ならカード枠と100%正確に自動判別します！
    const num = parts[2] || "";       // 例: "1", "2" などの枠番号

    // メモリ構造へ選択したIDを記録
    currentEquippedItems[currentSelectedTargetField] = itemId;

    const displayId = (componentType === 'equip') ? `display_equip_${slotId}` : `display_card_${slotId}_${num}`;
    const displayEl = document.getElementById(displayId);
    
    if (displayEl) {
        // 💡 データベースファイルの有無を安全にチェックして名前をはめ込みます
        if (componentType === 'equip') {
            if (typeof equipmentItemMaster !== 'undefined' && equipmentItemMaster[itemId]) {
                displayEl.textContent = equipmentItemMaster[itemId].name;
                displayEl.style.color = "#c53030";
                
                // マウスを乗せた時のツールチップ効果
                let effectsText = equipmentItemMaster[itemId].base_effects.map(e => `${e.type}+${e.value}${e.is_percent ? '%' : ''}`).join(" / ");
                displayEl.title = `初期値: ${effectsText}`;
            }
        } else {
            if (typeof cardMaster !== 'undefined' && cardMaster[itemId]) {
                const rawCardName = cardMaster[itemId].name;
                const truncatedName = rawCardName.length > 3 ? rawCardName.substring(0, 3) + "…" : rawCardName;

                displayEl.textContent = truncatedName;
                displayEl.style.color = "#2b6cb0"; 
                
                let effectsText = cardMaster[itemId].effects.map(eff => `${eff.type}+${eff.value}${eff.is_percent ? '%' : ''}`).join(" / ");
                displayEl.title = `${rawCardName}\n効果: ${effectsText}`;
            }
        }
        displayEl.style.fontWeight = "bold"; // 太字に強調
    }

    // リアルタイム総合計の計算コアエンジンを回す
    calculateEquipmentTotalStatus();
}

// 装着されているカードや装備を外す（リセット）
function unequipItem(event, slotId, num) {
    event.stopPropagation(); // 行クリックイベントへの連鎖を止める安全策
    
    // 🌟【外す機能のバグ修正】新テーブルのメモリキー（部位_card_枠番号）を作成して正確に消去します
    const targetKey = `${slotId}_card_${num}`;
    delete currentEquippedItems[targetKey];
    
    // 🌟 画面上の表記を初期状態「(空き枠)」に戻し、色と太字をリセットします
    const displayId = `display_card_${slotId}_${num}`;
    const displayEl = document.getElementById(displayId);
    if (displayEl) {
        displayEl.textContent = "(空き枠)";
        displayEl.style.color = "#718096";
        displayEl.style.fontWeight = "normal";
        displayEl.title = "";
    }

    calculateEquipmentTotalStatus();
}

function syncWeaponModeFromEquipment(selectedMode) {
    // 装備タブ側で選ばれたスタイルに合わせて、大元のラジオボタンのチェックを一時的に手動で上書き
    if (selectedMode === 'oneHand') {
        if (document.getElementById("weaponMode1")) document.getElementById("weaponMode1").checked = true;
    } else if (selectedMode === 'dualWield') {
        if (document.getElementById("weaponMode3")) document.getElementById("weaponMode3").checked = true;
    } else if (selectedMode === 'twoHand') {
        if (document.getElementById("weaponMode2")) document.getElementById("weaponMode2").checked = true;
    }
    
    // 大元のメイン武器切り替え関数（toggleWeaponMode）を叩いて、TR非活性化や29マス再生成をフル稼働させる
    toggleWeaponMode();
}

// ==========================================================================
// 装備品ステータス集計メインエンジン
// ==========================================================================
function calculateEquipmentTotalStatus() {
    let equipmentTotals = {};     // 最終的な総合計ステータス

    let pureRefineTotals = {};    

    // 最終合計へステータスを安全に足し算（加算）するヘルパー
    const addStat = (type, val, isPercent) => {
        const cleanName = cleanStatNameByPercentFlag(type, isPercent);
        if (!equipmentTotals[cleanName]) {
            equipmentTotals[cleanName] = { value: 0, is_percent: isPercent };
        }
        equipmentTotals[cleanName].value += val;
    };

    // 精錬のみの数値を安全に足し算するヘルパー
    const addPureRefineStat = (type, val, isPercent) => {
        const cleanName = cleanStatNameByPercentFlag(type, isPercent);
        if (!pureRefineTotals[cleanName]) {
            pureRefineTotals[cleanName] = { value: 0, is_percent: isPercent };
        }

        pureRefineTotals[cleanName].value = (pureRefineTotals[cleanName].value || 0) + val;; 
    };

    // 🌟 影装カスタム・キャラクター初期入力値の先出し合流
    const getBaseInputValue = (id) => parseFloat(document.getElementById(id)?.value) || 0;
    if (getBaseInputValue("baseInput_pen") > 0) addStat("最終物理貫通", getBaseInputValue("baseInput_pen"), true);
    if (getBaseInputValue("baseInput_amp") > 0) addStat("最終物理増強", getBaseInputValue("baseInput_amp"), true);
    if (getBaseInputValue("baseInput_matk_pen") > 0) addStat("最終魔法貫通", getBaseInputValue("baseInput_matk_pen"), true);
    if (getBaseInputValue("baseInput_matk_amp") > 0) addStat("最終魔法増強", getBaseInputValue("baseInput_matk_amp"), true);

    // 🔍 1. 全活性部位の「精錬レベル」と「強化レベル」の最低値を同時にスキャン
    const awakeTargets = [
        "oneHand", "twoHand", "subWeapon",
        "head", "armor", "shoulder", "shoes",
        "accLeft", "accRight", "talisman"
    ];

    let activeRefineLevels = [];
    let activeEnhanceLevels = [];

    const isDualWieldMode = document.getElementById("weaponMode3")?.checked || document.getElementById("weaponMode3_eq")?.checked || false;
    const isTwoHandMode = document.getElementById("weaponMode2")?.checked || document.getElementById("weaponMode2_eq")?.checked || false;

    for (let key in slots) {
        const slotId = slots[key].id;

        // 二刀流・両手武器の排他処理
        if (slotId === "twoHand" && !isTwoHandMode) continue;
        if ((slotId === "oneHand" || slotId === "subWeapon") && isTwoHandMode) continue;

        // ⭐ 覚醒対象外スロットは無視
        if (!awakeTargets.includes(slotId)) continue;

        // --- 精錬レベル収集 ---
        const refineSelect = document.getElementById(`refine_${slotId}`) || document.getElementById(`equip_refine_${slotId}`);
        if (refineSelect) {
            const refineValRaw = refineSelect.value;
            if (refineValRaw !== "" && refineValRaw !== null && refineValRaw !== undefined) {
                const currentRefineVal = parseInt(refineValRaw) || 0;
                activeRefineLevels.push(currentRefineVal);
            }
        }

        // --- 強化レベル収集 ---
        const enhanceInput = document.getElementById(`enhance_${slotId}`) || document.getElementById(`equip_enhance_${slotId}`);
        if (enhanceInput) {
            const enhanceValRaw = enhanceInput.value;
            if (enhanceValRaw !== "" && enhanceValRaw !== null && enhanceValRaw !== undefined) {
                const currentEnhanceVal = parseInt(enhanceValRaw) || 0;
                activeEnhanceLevels.push(currentEnhanceVal);
            }
        }
    }

    // ---=================================================
    // 🌟 精錬覚醒（全対象スロットの精錬最低値で判定）
    // ---=================================================
    let refineAwakeningRate = 0;
    let refineLabelText = "精錬覚醒なし (0%)";
    let isRefineAwakeActive = false;

    if (activeRefineLevels.length > 0) {
        const lowestRefineLevel = Math.min(...activeRefineLevels);

        if (lowestRefineLevel >= 3) {
            const bonusPercent = 15 + (lowestRefineLevel - 3) * 5;
            refineAwakeningRate = bonusPercent / 100;
            refineLabelText = `精錬覚醒 Lv.${lowestRefineLevel} (+${bonusPercent}%)`;
            isRefineAwakeActive = true;
        }
    }

    const refineBadge = document.getElementById("equipmentRefineAwakeningBadge");
    if (refineBadge) {
        refineBadge.textContent = refineLabelText;
        refineBadge.classList.toggle("active-awake", isRefineAwakeActive);
    }

    // ---=================================================
    // 🌟 強化覚醒（全対象スロットの強化最低値で判定）
    // ---=================================================
    let enhanceAwakeningRate = 0;
    let enhanceLabelText = "強化覚醒なし (0%)";
    let isEnhanceAwakeActive = false;

    if (activeEnhanceLevels.length > 0) {
        const lowestEnhanceLevel = Math.min(...activeEnhanceLevels);

        if (lowestEnhanceLevel >= 120) {
            enhanceAwakeningRate = 1.00;
            enhanceLabelText = `強化覚醒 Lv.120 (+100%)`;
            isEnhanceAwakeActive = true;
        } else if (lowestEnhanceLevel >= 110) {
            enhanceAwakeningRate = 0.90;
            enhanceLabelText = `強化覚醒 Lv.110 (+90%)`;
            isEnhanceAwakeActive = true;
        } else if (lowestEnhanceLevel >= 100) {
            enhanceAwakeningRate = 0.80;
            enhanceLabelText = `強化覚醒 Lv.100 (+80%)`;
            isEnhanceAwakeActive = true;
        }
    }

    const enhanceBadge = document.getElementById("equipmentEnhanceAwakeningBadge");
    if (enhanceBadge) {
        enhanceBadge.textContent = enhanceLabelText;
        enhanceBadge.classList.toggle("active-enhance-awake", isEnhanceAwakeActive);
    }


    // 🔍 2. 各部位を走査してベース・強化・精錬値を集計
    for (let key in slots) {
        const slotId = slots[key].id;
        if (slotId === "twoHand" && !isTwoHandMode) continue;
        if ((slotId === "oneHand" || slotId === "subWeapon") && isTwoHandMode) continue;

        const refineSelect = document.getElementById(`refine_${slotId}`) || document.getElementById(`equip_refine_${slotId}`);
        const currentRefineVal = refineSelect ? parseInt(refineSelect.value) || 0 : 0;

        const equippedItemId = currentEquippedItems[`${slotId}_equip`];
        if (equippedItemId && typeof equipmentItemMaster !== 'undefined') {
            const item = equipmentItemMaster[equippedItemId];
            
            // サブ武器スロットであり、二刀流チェックボックスが外れている（片手盾スタイル）なら、カテゴリを「盾」にロックオン！
            let category = item.category;
            if (slotId === "subWeapon" && !isDualWieldMode) {
                category = "盾";
            }

            // A) 基礎能力値 (固有・ベース効果) ➔ 直接加算
            if (item.base_effects && Array.isArray(item.base_effects)) {
                item.base_effects.forEach(eff => addStat(eff.type, eff.value, eff.is_percent));
            }

            // B) ⚡【累積型・汎用成長エンジン：強化セクション】
            const enhanceInput = document.getElementById(`enhance_${slotId}`) || document.getElementById(`equip_enhance_${slotId}`);
            const enhanceLevel = enhanceInput ? parseInt(enhanceInput.value) || 0 : 0;
            
            if (enhanceLevel > 0 && item.enhance_effects_types) {
                let currentSlotCategory = slots[slotId]?.apiKey || item.category;
                if (slotId === "accLeft" || slotId === "accRight") {
                    currentSlotCategory = "アクセ";
                } else if (slotId === "talisman") {
                    currentSlotCategory = "お守り";
                } else if (slotId === "subWeapon" && !isDualWieldMode) {
                    currentSlotCategory = "サブ武器"; 
                }

                item.enhance_effects_types.forEach(statName => {
                    let initialValue = 0;
                    if (item.base_effects && Array.isArray(item.base_effects)) {
                        const matchEffect = item.base_effects.find(eff => eff.type === statName);
                        if (matchEffect) initialValue = matchEffect.value;
                    }

                    let initialAdd = 0;
                    const realItemCategory = (slotId === "subWeapon" && !isDualWieldMode) ? "サブ武器" : item.category;
                    if (typeof enhanceStatMaster !== 'undefined' && enhanceStatMaster[statName]) {
                        if (enhanceStatMaster[statName][realItemCategory] !== undefined) {
                            initialAdd = enhanceStatMaster[statName][realItemCategory];
                        }
                    }

                    const baseStartValue = initialValue + initialAdd;
                    const finalEnhanceValue = calcGenericEnhance(statName, baseStartValue, enhanceLevel, currentSlotCategory);
                    
                    let correctStatName = statName;
                    const isPercentType = false; 

                    if (correctStatName.endsWith("%")) {
                        correctStatName = correctStatName.replace("%", "");
                    }

                    addStat(correctStatName, finalEnhanceValue, isPercentType);
                });
            }

            // C) 精錬ボーナスの計算
            if (currentRefineVal > 0 && item.refine_effects_types && typeof refineStatMaster !== 'undefined') {
                item.refine_effects_types.forEach(statName => {
                    const statMaster = refineStatMaster[statName];
                    
                    if (statMaster && statMaster[category] && statMaster[category][currentRefineVal] !== undefined) {
                        const pureRefineValue = statMaster[category][currentRefineVal]; 
                        
                        let correctStatName = unifyStatName(statName);
                        
                        let isPercent =
                            statName.includes("最終") ||
                            statName.includes("CRI") ||
                            statName.includes("%");

                        if (correctStatName.endsWith("%")) {
                            correctStatName = correctStatName.replace("%", "");
                        }
                        
                        // ⭐ 純粋な精錬値だけを入れる（覚醒はまだ適用しない）
                        addPureRefineStat(correctStatName, pureRefineValue, isPercent);
                    }
                });
            }
        }

        // D) 装着中の各カード枠の効果を集計（％なし名前規格へ完全同期！）
        for (let num = 1; num <= 5; num++) {
            const cardId = currentEquippedItems[`${slotId}_card_${num}`];
            const currentCardMaster = (typeof cardMaster !== 'undefined') ? cardMaster : (typeof cardtMaster !== 'undefined' ? cardtMaster : undefined);
            
            if (cardId && currentCardMaster && currentCardMaster[cardId]) {
                const card = currentCardMaster[cardId];
                card.effects.forEach(eff => {
                    let correctStatName = eff.type;
                    
                    // エンチャント側のルールに合わせ、名前の末尾からは「%」を綺麗に剥ぎ取ります
                    if (correctStatName.endsWith("%")) {
                        correctStatName = correctStatName.replace("%", "");
                    }
                    
                    // カードのデータが持っている本来の％フラグ（eff.is_percent）をそのまま安全に引き継ぎます
                    addStat(correctStatName, eff.value, eff.is_percent);
                });
            }
        }
    }

    // ---=================================================
    // 3. 🌟【究極のツイン乗算合算処理】
    // 精錬プールに対して、「精錬覚醒倍率 ＋ 強化覚醒倍率」の合算パーセントをダイレクトに掛け算します！
    // ---=================================================
    const totalAwakeningRate = refineAwakeningRate; 

    for (let statName in pureRefineTotals) {
        const refineItem = pureRefineTotals[statName];
        const baseRefineValue = refineItem.value; // 元の精錬値（例: 40%）
        
        // 💡 精錬覚醒と強化覚醒の合算ボーナス分を綺麗に乗算算出！
        const twinAwakeBonusValue = baseRefineValue * totalAwakeningRate;
        
        // 元の精錬値に、ツイン覚醒の掛け算ボーナスを足して、最終合計へ合流！
        const finalCalculatedValue = baseRefineValue + twinAwakeBonusValue;
        
        addStat(statName, finalCalculatedValue, refineItem.is_percent);
    }

    // ---=================================================
    // 4. 📊 画面上部への合計カード一斉描画
    // ---=================================================
    const summaryDisplay = document.getElementById("equipmentTotalSummaryDisplay");
    if (!summaryDisplay) return;

    if (Object.keys(equipmentTotals).length === 0) {
        summaryDisplay.innerHTML = '<p class="no-data-text">装備やカードを装着すると、ここにリアルタイムで合計が算出されます。</p>';
        return;
    }

    let html = "";
    for (let typeName in equipmentTotals) {
        const item = equipmentTotals[typeName];
        
        // 💡 名前部分には％を付けず、カードの「数値の右端（単位）」にだけ綺麗に％を自動で添えます！
        const unit = item.is_percent ? "%" : "";
        const formattedVal = Math.round(item.value * 100) / 100;
        
        if (formattedVal > 0) {
            html += `
                <div class="summary-card" style="border-left: 4px solid #3182ce;">
                    <div class="card-status-name">${typeName}</div>
                    <div class="card-status-value">+${formattedVal}${unit}</div>
                </div>
            `;
        }
    }
    summaryDisplay.innerHTML = html;
}


function cleanStatNameByPercentFlag(rawName, isPercentData) {
    if (!rawName) return "";
    let name = rawName;
    
    // エンチャント側の「名前部分には％を付けない」という絶対ルールに合わせ、
    // データの末尾に「%」が混ざってしまっている不純物があれば、ここで綺麗に剥ぎ取って一本化します！
    if (name.endsWith("%")) {
        name = name.replace("%", "");
    }
    return name;
}

// ==========================================================================
// 💾 装備シミュレータ専用：LocalStorage対応 プラン保存・読込・削除機能
// ==========================================================================

// 💡 画面が最初に開いた時（DOMロード時）に、保存済み装備プランのプルダウンを自動更新
window.addEventListener('DOMContentLoaded', () => {
    updateSavedEquipmentPlansDropdown();
});

// 1. 保存済み装備プランのプルダウンメニューを最新状態に書き換える関数
function updateSavedEquipmentPlansDropdown() {
    const selectEl = document.getElementById("savedEquipPlansSelect");
    if (!selectEl) return;

    const savedPlans = JSON.parse(localStorage.getItem("rox_equip_plans")) || {};

    let html = '<option value="">-- プランを選択 --</option>';
    for (let planName in savedPlans) {
        html += `<option value="${planName}">${planName}</option>`;
    }
    selectEl.innerHTML = html;
}

// 2. 現在の画面上のすべての装備・精錬・強化・初期構成を一括保存する関数
function saveCurrentEquipmentPlan() {
    const planNameInput = document.getElementById("equipPlanNameInput");
    const planName = planNameInput ? planNameInput.value.trim() : "";
    
    if (!planName) {
        alert("装備プラン名を入力してください。");
        return;
    }

    const isOneHand = document.querySelector('input[name="weaponMode"][value="oneHand"]')?.checked || false;
    const isDualWield = document.querySelector('input[name="weaponMode"][value="dualWield"]')?.checked || false;

    let equipPlanData = {
        weaponMode: isOneHand ? 'oneHand' : (isDualWield ? 'dualWield' : 'twoHand'),
        baseInputs: {
            pen: document.getElementById("baseInput_pen")?.value || "0",
            amp: document.getElementById("baseInput_amp")?.value || "0",
            matk_pen: document.getElementById("baseInput_matk_pen")?.value || "0",
            matk_amp: document.getElementById("baseInput_matk_amp")?.value || "0"
        },
        equippedItems: { ...currentEquippedItems },
        numericalValues: {}
    };

    for (let key in slots) {
        const slotId = slots[key].id;
        equipPlanData.numericalValues[slotId] = {
            refine: document.getElementById(`refine_${slotId}`)?.value || "0",
            enhance: document.getElementById(`enhance_${slotId}`)?.value || "100"
        };
    }

    let savedPlans = JSON.parse(localStorage.getItem("rox_equip_plans")) || {};
    savedPlans[planName] = equipPlanData;
    localStorage.setItem("rox_equip_plans", JSON.stringify(savedPlans));
    
    if (planNameInput) planNameInput.value = "";
    alert(`装備プラン「${planName}」を無事にローカル保存しました！`);
    
    updateSavedEquipmentPlansDropdown();
}

// 3. プルダウンで選ばれた過去の装備構成を一瞬で画面上に完全展開する関数
function loadSelectedEquipmentPlan() {
    const selectEl = document.getElementById("savedEquipPlansSelect");
    if (!selectEl) return;
    const planName = selectEl.value;
    if (!planName) return;

    const savedPlans = JSON.parse(localStorage.getItem("rox_equip_plans")) || {};
    const plan = savedPlans[planName];
    if (!plan) return;

    const targetMainRadio = document.querySelector(`input[name="weaponMode"][value="${plan.weaponMode}"]`);
    if (targetMainRadio) {
        targetMainRadio.checked = true;
    }
    toggleWeaponMode();

    if (plan.baseInputs) {
        if (document.getElementById("baseInput_pen")) document.getElementById("baseInput_pen").value = plan.baseInputs.pen;
        if (document.getElementById("baseInput_amp")) document.getElementById("baseInput_amp").value = plan.baseInputs.amp;
        if (document.getElementById("baseInput_matk_pen")) document.getElementById("baseInput_matk_pen").value = plan.baseInputs.matk_pen;
        if (document.getElementById("baseInput_matk_amp")) document.getElementById("baseInput_matk_amp").value = plan.baseInputs.matk_amp;
    }

    currentEquippedItems = plan.equippedItems ? { ...plan.equippedItems } : {};

    initEquipmentSimulator();

    if (plan.numericalValues) {
        for (let slotId in plan.numericalValues) {
            const data = plan.numericalValues[slotId];
            const refineSelect = document.getElementById(`refine_${slotId}`);
            const enhanceInput = document.getElementById(`enhance_${slotId}`);
            
            if (refineSelect) refineSelect.value = data.refine || "0";
            if (enhanceInput) enhanceInput.value = data.enhance || "100";
        }
    }

    calculateEquipmentTotalStatus();
}

// 4. 不要になった装備プランをストレージから安全に消去する関数
function deleteSelectedEquipmentPlan() {
    const selectEl = document.getElementById("savedEquipPlansSelect");
    const planName = selectEl ? selectEl.value : "";
    if (!planName) {
        alert("削除する装備プランを選択してください。");
        return;
    }

    if (confirm(`本当に装備プラン「${planName}」を削除してもよろしいですか？`)) {
        let savedPlans = JSON.parse(localStorage.getItem("rox_equip_plans")) || {};
        delete savedPlans[planName];
        localStorage.setItem("rox_equip_plans", JSON.stringify(savedPlans));
        
        updateSavedEquipmentPlansDropdown();
        calculateEquipmentTotalStatus();
        alert("装備プランを削除しました。");
    }
}

function addTier(lv, start, end, coef) {
    const s = Math.max(Math.min(lv, end) - start, 0);
    return s * coef;
}

// 🌟 2. 初期10レベル分の汎用計算ルール（エラー防止用ガード）
function calcInitialGeneric(statName, initialAdd, lv) {
    const currentLv = Math.min(lv, 10);
    return initialAdd * currentLv;
}

// 🌟 3. 【最終完成形：カテゴリ最優先・汎用強化計算マシン】
// ステータス名、初期値、現在のレベル、そして「カテゴリ（両手武器、片手武器、サブ武器等）」を渡すだけで、
// カテゴリごとの「固有の係数（比重）」を裏側で完璧に嗅ぎ分け、1の位まで正確な累積強化値を返却します！
function calcGenericEnhance(statName, initialAdd, lv, category) {
    
    // 🎨【新設計】カテゴリごとに係数（比重）を完全に分断した定数データベース
    const tierGrowth = {
        "両手武器": {
            "物理攻撃": { "g2": 13, "g3": 17.8, "g4": 27.2, "g5": 31, "g6": 38 },
            "魔法攻撃": { "g2": 13, "g3": 17.8, "g4": 27.2, "g5": 31, "g6": 38 },
            "攻撃速度": { "h2": 7,  "h3": 7.9,  "h4": 13.8, "h5": 16, "h6": 19 }
        },
        "片手武器": {
            // 🗡️【拡張枠】片手武器は両手武器に比べて比重が低くなる（例：0.75倍など）ゲーム内の実測係数をここに直書きできます！
            "物理攻撃": { "g2": 9.75, "g3": 13.35, "g4": 20.4, "g5": 23.25, "g6": 28.5 },
            "魔法攻撃": { "g2": 9.75, "g3": 13.35, "g4": 20.4, "g5": 23.25, "g6": 28.5 },
            "攻撃速度": { "h2": 5.25, "h3": 5.92,  "h4": 10.35, "h5": 12,    "h6": 14.25 }
        },
        "サブ武器": {
            // 🛡️【拡張枠】盾や、二刀流の左手用に適用される固有の比重係数を直書きできます！
            "物理攻撃": { "g2": 6.5, "g3": 8.9, "g4": 13.6, "g5": 15.5, "g6": 19 },
            "物理防御": { "i2": 3,   "i3": 5.2, "i4": 8.5,  "i5": 11,   "i6": 14 } // 今後防具等が増えてもここへ行を足すだけ！
        },
        "アクセ": {
            "物理増強":    { "g1": [2, 3, 5, 6, 8, 9, 11 , 13 , 14, 16],
                             "g2": 3.25, "g3": 4.45, "g4": 6.8, "g5": 7.75, "g6": 9 },
            "魔法増強":    { "g1": [3, 6, 9, 13, 16, 19, 22, 25, 28, 31],
                             "g2": 3.25, "g3": 4.45, "g4": 6.8, "g5": 7.75, "g6": 9 },
            "物理貫通":    { "g1": [2, 3, 5, 6, 8, 9, 11 , 13 , 14, 16],
                             "g2": 3.25, "g3": 4.45, "g4": 6.8, "g5": 7.75, "g6": 9 },
            "魔法貫通":    { "g1": [2, 3, 5, 6, 8, 9, 11 , 13 , 14, 16],
                             "g2": 3.25, "g3": 4.45, "g4": 6.8, "g5": 7.75, "g6": 9 },
            "PVP物理増強": { "g1": [2, 3, 5, 6, 8, 9, 11 , 13 , 14, 16],
                             "g2": 3.25, "g3": 4.45, "g4": 6.8, "g5": 7.75, "g6": 9 },
            "PVP魔法増強": { "g1": [2, 3, 5, 6, 8, 9, 11 , 13 , 14, 16],
                             "g2": 3.25, "g3": 4.45, "g4": 6.8, "g5": 7.75, "g6": 9 },
            "物理攻撃":    { "g1": [2, 3, 5, 6, 8, 9, 11 , 13 , 14, 16],
                             "g2": 3.25, "g3": 4.45, "g4": 6.8, "g5": 7.75, "g6": 9 },
            "CRI":         { "g1": [2, 3, 5, 6, 8, 9, 11 , 13 , 14, 16],
                             "g2": 3.25, "g3": 4.45, "g4": 6.8, "g5": 7.75, "g6": 9 }
        },
        "お守り": {
            "物理増強":    { "g1": [3, 6, 9, 13, 16, 19, 22, 25, 28, 31],
                             "g2": 6.40, "g3": 8.76, "g4": 13.38, "g5": 15.25, "g6": 18.70 },
            "魔法増強":    { "g1": [3, 6, 9, 13, 16, 19, 22, 25, 28, 31],
                             "g2": 6.40, "g3": 8.76, "g4": 13.38, "g5": 15.25, "g6": 18.70 },
            "物理貫通":    { "g1": [3, 6, 9, 13, 16, 19, 22, 25, 28, 31],
                             "g2": 6.40, "g3": 8.76, "g4": 13.38, "g5": 15.25, "g6": 18.70 },
            "魔法貫通":    { "g1": [3, 6, 9, 13, 16, 19, 22, 25, 28, 31],
                             "g2": 6.40, "g3": 8.76, "g4": 13.38, "g5": 15.25, "g6": 18.70 },
            "PVP物理増強": { "g1": [3, 6, 9, 13, 16, 19, 22, 25, 28, 31],
                             "g2": 6.40, "g3": 8.76, "g4": 13.38, "g5": 15.25, "g6": 18.70 },
            "PVP魔法増強": { "g1": [3, 6, 9, 13, 16, 19, 22, 25, 28, 31],
                             "g2": 6.40, "g3": 8.76, "g4": 13.38, "g5": 15.25, "g6": 18.70 }
        }
    };
    
    const categoryGroup = tierGrowth[category];
    const growthGroup = categoryGroup ? categoryGroup[statName] : null;

    let totalValue = 0;

    // -----------------------------
    // ⭐ G1 がある場合の処理
    // -----------------------------
    if (growthGroup && Array.isArray(growthGroup.g1)) {

        // Lv1〜10 は G1 の実測値をそのまま使う
        if (lv <= 10) {
            totalValue = growthGroup.g1[lv - 1];  // g1[0] が Lv1
        } else {
            // Lv11 以上は G1 の Lv10 を起点にする
            totalValue = growthGroup.g1[9]; // Lv10 の値
        }

    } else {

        // -----------------------------
        // ⭐ G1 がない場合（従来の初期加算値方式）
        // -----------------------------
        totalValue = calcInitialGeneric(statName, initialAdd, lv);
    }

    // -----------------------------
    // ⭐ G2〜G6 の帯加算（共通）
    // -----------------------------
    
    if (categoryGroup) {
        // 🌟 2階層目：そのカテゴリの中にある、該当「ステータス名」の係数（g2〜g6等）を取得
        const growthGroup = categoryGroup[statName];
        
        if (growthGroup) {
            // 🌟 3階層目：素材帯（g2〜g6）をループして、お預かりした階段ルールで累積加算！
            for (let gradeKey in growthGroup) {
                const coef = growthGroup[gradeKey]; // カテゴリごとに完璧に差別化された本物の係数

                // レベル帯ごとの階段累積ルール（10-30、30-50、50-70、70-90、90-120）
                if (gradeKey.includes("2")) totalValue += addTier(lv, 10, 30, coef);
                if (gradeKey.includes("3")) totalValue += addTier(lv, 30, 50, coef);
                if (gradeKey.includes("4")) totalValue += addTier(lv, 50, 70, coef);
                if (gradeKey.includes("5")) totalValue += addTier(lv, 70, 90, coef);
                if (gradeKey.includes("6")) totalValue += addTier(lv, 90, 120, coef);
            }
        }
    }

    // 四捨五入して、最終的に1つの「綺麗な整数値」として呼び出し元へ返却
    return Math.floor(totalValue);
}

// ==========================================================================
// その他設定（ギルド・影装・神紋）専用 独立計算・出力エンジン
// ==========================================================================

// ==========================================================================
// 🛡️ JSONマスタ（sinmonItemMaster）から画面へ神紋プルダウンを全自動生成する関数
// ==========================================================================

// 💡 現在画面上で見えている神紋のキー名（初期値は 'sword'）
let currentActiveSinmonKey = 'sword';

// 1. JSONマスタ（sinmonItemMaster）から神紋ごとのミニタブボタンを全自動で組み立てる関数
function renderSinmonTabNavigation() {
    const navContainer = document.getElementById("sinmonTabNavigation");
    if (!navContainer || typeof sinmonItemMaster === 'undefined') return;

    let html = "";
    for (let crestKey in sinmonItemMaster) {
        const crestData = sinmonItemMaster[crestKey];
        const isActive = (crestKey === currentActiveSinmonKey) ? "active-tab" : "";
        
        html += `
            <button class="tab-btn ${isActive}" onclick="switchSinmonTab('${crestKey}')" style="padding: 6px 16px; font-size: 12px; border-radius: 4px 4px 0 0;">
                ${crestData.name}
            </button>
        `;
    }
    navContainer.innerHTML = html;
}

// 2. ミニタブが切り替わった時に、「表示/非表示（クラスの付け外し）」だけでサクサク切り替える関数
function switchSinmonTab(crestKey) {
    currentActiveSinmonKey = crestKey;
    
    // ① ミニタブボタンの青いアクティブ着色を更新
    renderSinmonTabNavigation();
    
    // ② 画面上のすべての神紋コンテナ（塊）を一旦非表示にし、選ばれた神紋の塊だけをパッと表示！
    // 💡 これにより、裏側で他の神紋プルダウンに入力されている数値が消えずに100%完全キープされます！
    if (typeof sinmonItemMaster !== 'undefined') {
        for (let key in sinmonItemMaster) {
            const blockEl = document.getElementById(`sinmon_block_container_${key}`);
            if (blockEl) {
                if (key === currentActiveSinmonKey) {
                    blockEl.style.setProperty("display", "flex", "important");
                } else {
                    blockEl.style.setProperty("display", "none", "important");
                }
            }
        }
    }
}

// 3. マスタに登録されているすべての神紋（剣・槍・槌など）の7枠スロット（最大35枠）を、最初に「すべて」裏側に自動生成して敷き詰める関数
function renderDynamicCrestForms() {
    const container = document.getElementById("dynamicCrestContainer");
    if (!container || typeof sinmonItemMaster === 'undefined') return;

    let html = "";
    
    // 💡 マスタにあるすべての神紋（"sword" など）の数だけ、完全に独立した特大コンテナを縦に全種類作ります
    for (let crestKey in sinmonItemMaster) {
        const crestData = sinmonItemMaster[crestKey];
        
        // 最初は 'sword' 以外は非表示（display: none）の状態で、裏側（DOM）に安全にスタンバイさせます
        const initialDisplay = (crestKey === currentActiveSinmonKey) ? "display: flex !important;" : "display: none !important;";

        html += `
            <div id="sinmon_block_container_${crestKey}" class="sinmon-vertical-layout" style="${initialDisplay} flex-direction: column !important; gap: 8px !important; width: 100% !important;">
        `;

        for (let slotNum = 1; slotNum <= 7; slotNum++) {
            let statOptionsHtml = '<option value="none" selected>-- ステータス効果を選択 --</option>';
            for (let statKey in crestData.stats) {
                const stat = crestData.stats[statKey];
                const cleanLabel = stat.label.replace("txt ", "");
                statOptionsHtml += `<option value="${statKey}">${cleanLabel}</option>`;
            }

            // 💡【重要】すべてのプルダウンと出力列のID名に、神紋キー（例: _sword_ や _spear_）をガチッと刻み込んでメモリを完全分離！
            html += `
                <div class="sinmon-slot-row">
                    <div class="slot-index-label">枠 ${slotNum}</div>
                    <div class="slot-selectors-group">
                        <!-- 変更されたら、その神紋専用の重複フィルター（updateSinmonOptions）と一斉合算（calculateOtherTotalStatus）を呼び出す -->
                        <select id="other_crest_stat_${crestKey}_slot_${slotNum}" class="sinmon-stat-select" onchange="updateSinmonOptions('${crestKey}'); calculateOtherTotalStatus();">
                            ${statOptionsHtml}
                        </select>
                        <select id="other_crest_color_${crestKey}_slot_${slotNum}" class="sinmon-color-select" onchange="calculateOtherTotalStatus()">
                            <option value="none" selected>未解放</option>
                            <option value="white">白</option>
                            <option value="blue">青</option>
                            <option value="purple">紫</option>
                            <option value="orange">橙</option>
                        </select>
                    </div>
                    <div id="other_crest_val_display_${crestKey}_slot_${slotNum}" class="slot-value-display-side">-</div>
                </div>
            `;
        }

        html += `</div>`; // .sinmon_block_container の閉じタグ
    }
    container.innerHTML = html;
    
    // 全神紋の初期重複フィルターを一斉起動
    for (let crestKey in sinmonItemMaster) {
        updateSinmonOptions(crestKey);
    }
}

// 4. 指定された神紋内（例: 'sword' の中だけ）で、選ばれた効果を他の枠から非表示にする重複禁止制限エンジン
function updateSinmonOptions(crestKey) {
    if (!crestKey) crestKey = currentActiveSinmonKey;
    
    let selectedStats = {};
    for (let i = 1; i <= 7; i++) {
        const selectEl = document.getElementById(`other_crest_stat_${crestKey}_slot_${i}`);
        if (selectEl && selectEl.value !== "none") {
            selectedStats[i] = selectEl.value;
        }
    }

    for (let i = 1; i <= 7; i++) {
        const currentSelect = document.getElementById(`other_crest_stat_${crestKey}_slot_${i}`);
        if (!currentSelect) continue;

        Array.from(currentSelect.options).forEach(option => {
            if (option.value === "none") return;

            let isUsedByOtherSlot = false;
            for (let slotKey in selectedStats) {
                if (parseInt(slotKey) !== i && selectedStats[slotKey] === option.value) {
                    isUsedByOtherSlot = true;
                    break;
                }
            }

            if (isUsedByOtherSlot) {
                option.disabled = true;
                option.style.display = "none"; 
            } else {
                option.disabled = false;
                option.style.display = "";
            }
        });
    }
}

// 🌟【初期ロードトリガー】
window.addEventListener('DOMContentLoaded', () => {
    if (typeof renderDynamicCrestForms === 'function') renderDynamicCrestForms();
    if (typeof renderSinmonTabNavigation === 'function') renderSinmonTabNavigation();
});


// ==========================================================================
// ⚙️ その他設定（ギルド・影装・【7枠スロット・重複ロック付】神紋）計算エンジン
// ==========================================================================
function calculateOtherTotalStatus() {
    let otherTotals = {}; // その他設定タブの中だけで完結する独立した集計箱

    const addOtherStat = (type, val, isPercent) => {
        if (!otherTotals[type]) {
            otherTotals[type] = { value: 0, is_percent: isPercent };
        }
        otherTotals[type].value += val;
    };

    // 🌟 影装の段階累積計算用・ローカル汎用関数
    const calcShadowTierValue = (lv) => {
        if (lv <= 0) return 0;
        const addShadowTier = (currentLv, start, end, coef) => {
            const s = Math.max(Math.min(currentLv, end) - start, 0);
            return s * coef;
        };
        let totalPercent = 0;
        totalPercent += addShadowTier(lv, 0,  10, 0.6);
        totalPercent += addShadowTier(lv, 10, 20, 1.8);
        totalPercent += addShadowTier(lv, 20, 25, 2.2);
        totalPercent += addShadowTier(lv, 25, 30, 2.6);
        totalPercent += addShadowTier(lv, 30, 35, 3.0);
        return Math.round(totalPercent * 100) / 100;
    };

    // 🔍 1. 🏰 ギルドの祝福セクション
    const guildPPenLv = parseInt(document.getElementById("other_guild_p_pen_lv")?.value) || 0;
    if (guildPPenLv > 0) addOtherStat("物理貫通", guildPPenLv * 10, false);

    const guildMPenLv = parseInt(document.getElementById("other_guild_m_pen_lv")?.value) || 0;
    if (guildMPenLv > 0) addOtherStat("魔法貫通", guildMPenLv * 10, false);

    // 🔍 2. 🔮 影装（シャドウウェポン）セクション
    const getShadowLv = (id) => parseInt(document.getElementById(id)?.value) || 0;
    
    const shadowPAtkAmpLv = getShadowLv("other_shadow_pvp_p_amp_lv");
    if (shadowPAtkAmpLv > 0) addOtherStat("PVP最終物理増強", calcShadowTierValue(shadowPAtkAmpLv), true);

    const shadowMAtkAmpLv = getShadowLv("other_shadow_pvp_m_amp_lv");
    if (shadowMAtkAmpLv > 0) addOtherStat("PVP最終魔法増強", calcShadowTierValue(shadowMAtkAmpLv), true);

    const shadowPResLv = getShadowLv("other_shadow_pvp_p_res_lv");
    if (shadowPResLv > 0) addOtherStat("PVP最終物理ダメージ軽減", calcShadowTierValue(shadowPResLv), true);

    const shadowMResLv = getShadowLv("other_shadow_pvp_m_res_lv");
    if (shadowMResLv > 0) addOtherStat("PVP最終魔法ダメージ軽減", calcShadowTierValue(shadowMResLv), true);


    // ---=================================================
    // 🔍 3. 🛡️【7枠スロット重複制限対応】神紋データの集計
    // ---=================================================
    if (typeof sinmonItemMaster !== 'undefined') {
        
        // 💡 画面上のミニタブの選択状態に関係なく、JSONに存在する「すべての神紋キー」をループで総舐めします！
        for (let crestKey in sinmonItemMaster) {
            const activeCrestStats = sinmonItemMaster[crestKey].stats;

            for (let slotNum = 1; slotNum <= 7; slotNum++) {
                // 完全独立化した固有のID名（例: other_crest_sword_slot_1 や other_crest_spear_slot_1）を正確に狙い撃ち
                const statSelect = document.getElementById(`other_crest_stat_${crestKey}_slot_${slotNum}`);
                const colorSelect = document.getElementById(`other_crest_color_${crestKey}_slot_${slotNum}`);
                const displayEl = document.getElementById(`other_crest_val_display_${crestKey}_slot_${slotNum}`);

                const selectedStatKey = statSelect ? statSelect.value : "none";
                const selectedColorKey = colorSelect ? colorSelect.value : "none";

                // 効果とレアリティ色が両方ハメられている場合
                if (selectedStatKey !== "none" && selectedColorKey !== "none" && activeCrestStats[selectedStatKey]) {
                    const targetStat = activeCrestStats[selectedStatKey];
                    const finalVal = targetStat.values[selectedColorKey]; // 数値を抽出
                    const unit = targetStat.is_percent ? "%" : "";

                    // ① その神紋スロットの右端の列（ディスプレイ）に現在の計算数値をリアルタイム描画
                    if (displayEl) {
                        displayEl.textContent = `+${finalVal}${unit}`;
                    }

                    // ② エンチャント側のルールに合わせ、名前に「%」を含ませないクリーンなキー名に成型
                    let correctStatName = targetStat.label.replace("txt ", "");
                    if (typeof cleanStatNameByPercentFlag === 'function') {
                        correctStatName = cleanStatNameByPercentFlag(correctStatName, targetStat.is_percent);
                    }

                    // 👑【真の仕様】すべての神紋の数値が、同じステータス名ごとにバックグラウンドで「常時100%同時に合算」されます！
                    addOtherStat(correctStatName, finalVal, targetStat.is_percent);
                } 
                else {
                    if (displayEl) displayEl.textContent = "-";
                }
            }
        }
    }

    // ---=================================================
    // 🔍 4. 📊 その他設定画面専用の合計カードリアルタイム描画
    // ---=================================================
    const otherSummaryDisplay = document.getElementById("otherTotalSummaryDisplay");
    if (!otherSummaryDisplay) return;

    if (Object.keys(otherTotals).length === 0) {
        otherSummaryDisplay.innerHTML = '<p class="no-data-text">数値を入力すると、ここに合計がリアルタイムで集計されます。</p>';
        return;
    }

    let html = "";
    for (let typeName in otherTotals) {
        const item = otherTotals[typeName];
        const unit = item.is_percent ? "%" : "";
        const formattedVal = Math.round(item.value * 100) / 100;
        
        if (formattedVal > 0) {
            html += `
                <div class="summary-card" style="border-left: 4px solid #3182ce;">
                    <div class="card-status-name">${typeName}</div>
                    <div class="card-status-value">+${formattedVal}${unit}</div>
                </div>
            `;
        }
    }
    otherSummaryDisplay.innerHTML = html;
}

// ==========================================================================
// ↺ その他設定：各コンテンツセクション専用 ピンポイント個別リセット処理（全神紋対応版）
// ==========================================================================
function resetSectionValues(sectionKey) {
    if (sectionKey === 'guild') {
        if (document.getElementById("other_guild_p_pen_lv")) document.getElementById("other_guild_p_pen_lv").value = "0";
        if (document.getElementById("other_guild_m_pen_lv")) document.getElementById("other_guild_m_pen_lv").value = "0";
    } 
    else if (sectionKey === 'shadow') {
        const shadowIds = ["other_shadow_pvp_p_amp_lv", "other_shadow_pvp_m_amp_lv", "other_shadow_pvp_p_res_lv", "other_shadow_pvp_m_res_lv"];
        shadowIds.forEach(id => { if (document.getElementById(id)) document.getElementById(id).value = "0"; });
    } 
    else if (sectionKey === 'sinmon') {
        // 🌟 マスタに登録されている「すべての神紋」の全スロットを1発で一斉に未選択リセット！
        if (typeof sinmonItemMaster !== 'undefined') {
            for (let crestKey in sinmonItemMaster) {
                for (let slotNum = 1; slotNum <= 7; slotNum++) {
                    const statSelect = document.getElementById(`other_crest_stat_${crestKey}_slot_${slotNum}`);
                    const colorSelect = document.getElementById(`other_crest_color_${crestKey}_slot_${slotNum}`);
                    if (statSelect) statSelect.value = "none";
                    if (colorSelect) colorSelect.value = "none";
                }
                updateSinmonOptions(crestKey); // 重複フィルターもリフレッシュ
            }
        }
    }
    if (typeof calculateOtherTotalStatus === 'function') {
        calculateOtherTotalStatus();
    }
}

// ==========================================================================
// 💾 その他設定専用：LocalStorage対応 プラン保存・読込・削除機能 (全神紋・常時並列版)
// ==========================================================================
function updateSavedOtherPlansDropdown() {
    const selectEl = document.getElementById("savedOtherPlansSelect");
    if (!selectEl) return;
    const savedPlans = JSON.parse(localStorage.getItem("rox_other_plans")) || {};
    let html = '<option value="">-- プランを選択 --</option>';
    for (let planName in savedPlans) { html += `<option value="${planName}">${planName}</option>`; }
    selectEl.innerHTML = html;
}

// 2. 現在の画面上の「ギルド」「影装」「全種類の神紋すべて」を丸ごと一括パッケージ保存
function saveCurrentOtherPlan() {
    const planNameInput = document.getElementById("otherPlanNameInput");
    const planName = planNameInput ? planNameInput.value.trim() : "";
    if (!planName) { alert("その他プラン名を入力してください。"); return; }

    let otherPlanData = {
        guildValues: {
            p_pen: document.getElementById("other_guild_p_pen_lv")?.value || "0",
            m_pen: document.getElementById("other_guild_m_pen_lv")?.value || "0"
        },
        shadowValues: {
            p_amp: document.getElementById("other_shadow_pvp_p_amp_lv")?.value || "0",
            m_amp: document.getElementById("other_shadow_pvp_m_amp_lv")?.value || "0",
            p_res: document.getElementById("other_shadow_pvp_p_res_lv")?.value || "0",
            m_res: document.getElementById("other_shadow_pvp_m_res_lv")?.value || "0"
        },
        sinmonValuesObj: {} // 💡 すべての神紋の値を格納する巨大な連想配列
    };

    if (typeof sinmonItemMaster !== 'undefined') {
        for (let crestKey in sinmonItemMaster) {
            otherPlanData.sinmonValuesObj[crestKey] = [];
            for (let slotNum = 1; slotNum <= 7; slotNum++) {
                otherPlanData.sinmonValuesObj[crestKey].push({
                    slot: slotNum,
                    stat: document.getElementById(`other_crest_stat_${crestKey}_slot_${slotNum}`)?.value || "none",
                    color: document.getElementById(`other_crest_color_${crestKey}_slot_${slotNum}`)?.value || "none"
                });
            }
        }
    }

    let savedPlans = JSON.parse(localStorage.getItem("rox_other_plans")) || {};
    savedPlans[planName] = otherPlanData;
    localStorage.setItem("rox_other_plans", JSON.stringify(savedPlans));
    
    if (planNameInput) planNameInput.value = "";
    alert(`全神紋・成長一括プラン「${planName}」を保存しました！`);
    updateSavedOtherPlansDropdown();
}

// 3. プルダウンで選ばれた過去の「全神紋一斉構成」を一瞬で完全復元
function loadSelectedOtherPlan() {
    const selectEl = document.getElementById("savedOtherPlansSelect");
    if (!selectEl) return;
    const planName = selectEl.value;
    if (!planName) return;

    const savedPlans = JSON.parse(localStorage.getItem("rox_other_plans")) || {};
    const plan = savedPlans[planName];
    if (!plan) return;

    if (plan.guildValues) {
        if (document.getElementById("other_guild_p_pen_lv")) document.getElementById("other_guild_p_pen_lv").value = plan.guildValues.p_pen;
        if (document.getElementById("other_guild_m_pen_lv")) document.getElementById("other_guild_m_pen_lv").value = plan.guildValues.m_pen;
    }
    if (plan.shadowValues) {
        if (document.getElementById("other_shadow_pvp_p_amp_lv")) document.getElementById("other_shadow_pvp_p_amp_lv").value = plan.shadowValues.p_amp;
        if (document.getElementById("other_shadow_pvp_m_amp_lv")) document.getElementById("other_shadow_pvp_m_amp_lv").value = plan.shadowValues.m_amp;
        if (document.getElementById("other_shadow_pvp_p_res_lv")) document.getElementById("other_shadow_pvp_p_res_lv").value = plan.shadowValues.p_res;
        if (document.getElementById("other_shadow_pvp_m_res_lv")) document.getElementById("other_shadow_pvp_m_res_lv").value = plan.shadowValues.m_res;
    }

    // 💡 全神紋の一括復元処理
    if (plan.sinmonValuesObj && typeof sinmonItemMaster !== 'undefined') {
        for (let crestKey in sinmonItemMaster) {
            const slotArray = plan.sinmonValuesObj[crestKey];
            if (slotArray && Array.isArray(slotArray)) {
                slotArray.forEach(item => {
                    const statSelect = document.getElementById(`other_crest_stat_${crestKey}_slot_${item.slot}`);
                    const colorSelect = document.getElementById(`other_crest_color_${crestKey}_slot_${item.slot}`);
                    if (statSelect) statSelect.value = item.stat;
                    if (colorSelect) colorSelect.value = item.color;
                });
            }
            updateSinmonOptions(crestKey); // 各神紋の重複禁止ロックを再計算
        }
    }

    calculateOtherTotalStatus();
}

// 4. 不要になったプランを削除
function deleteSelectedOtherPlan() {
    const selectEl = document.getElementById("savedOtherPlansSelect");
    const planName = selectEl ? selectEl.value : "";
    if (!planName) { alert("削除するその他プランを選択してください。"); return; }

    if (confirm(`本当にプラン「${planName}」を削除してもよろしいですか？`)) {
        let savedPlans = JSON.parse(localStorage.getItem("rox_other_plans")) || {};
        delete savedPlans[planName];
        localStorage.setItem("rox_other_plans", JSON.stringify(savedPlans));
        updateSavedOtherPlansDropdown();
        resetSectionValues('sinmon'); // 綺麗にお掃除
        alert("プランを削除しました。");
    }
}

// ==========================================================================
// ⚔️ ダメージ計算機専用：3大タブ（エンチャント・装備・その他設定）
// ==========================================================================
function calculateDamageTabTotalMerge() {
    const displayEl = document.getElementById("damageTotalSummaryDisplay");
    if (!displayEl) return;

    let finalMergedTotals = {}; // すべてのタブの数値を美しく足し算する最終的な巨大な集計箱

    // 安全にステータスを加算合流させるヘルパー
    const mergeStat = (name, val, isPercent) => {
        if (!val || val <= 0) return;
        if (!finalMergedTotals[name]) {
            finalMergedTotals[name] = { value: 0, is_percent: isPercent };
        }
        finalMergedTotals[name].value += val;
    };

    // 🌟 1. 💎【エンチャントタブ】の画面表示カードからリアルタイム全自動回収！
    // 提示いただいた id="totalSummary_top" の中にあるすべてのステータスバッジをダイレクトにスキャンします
    const enchantGrid = document.getElementById("totalSummary_top");
    if (enchantGrid) {
        const cards = enchantGrid.getElementsByClassName("summary-card");
        Array.from(cards).forEach(card => {
            const name = card.querySelector(".card-status-name")?.textContent || "";
            const valText = card.querySelector(".card-status-value")?.textContent || "";
            
            const isPercent = valText.includes("%");
            // 「+」や「%」を綺麗に剥ぎ取って、計算できる綺麗な純粋な数字に変換
            const numVal = parseFloat(valText.replace("+", "").replace("%", "")) || 0;
            
            if (name && numVal > 0) {
                mergeStat(name, numVal, isPercent); // 👑 エンチャントの火力を完全に合流！
            }
        });
    }

    // 🌟 2. 🛡️【装備シミュレータタブ】の画面表示カードからリアルタイム回収
    const equipGrid = document.getElementById("equipmentTotalSummaryDisplay");
    if (equipGrid) {
        const cards = equipGrid.getElementsByClassName("summary-card");
        Array.from(cards).forEach(card => {
            const name = card.querySelector(".card-status-name")?.textContent || "";
            const valText = card.querySelector(".card-status-value")?.textContent || "";
            
            const isPercent = valText.includes("%");
            const numVal = parseFloat(valText.replace("+", "").replace("%", "")) || 0;
            
            if (name && numVal > 0) {
                mergeStat(name, numVal, isPercent);
            }
        });
    }

    // 🌟 3. ⚙️【その他設定タブ】の画面表示カードからリアルタイム回収
    const otherGrid = document.getElementById("otherTotalSummaryDisplay");
    if (otherGrid) {
        const cards = otherGrid.getElementsByClassName("summary-card");
        Array.from(cards).forEach(card => {
            const name = card.querySelector(".card-status-name")?.textContent || "";
            const valText = card.querySelector(".card-status-value")?.textContent || "";
            
            const isPercent = valText.includes("%");
            const numVal = parseFloat(valText.replace("+", "").replace("%", "")) || 0;
            
            if (name && numVal > 0) {
                mergeStat(name, numVal, isPercent);
            }
        });
    }

    // 🚨 4. もしすべてのページが未入力（空っぽ）なら、初期案内を表示
    if (Object.keys(finalMergedTotals).length === 0) {
        displayEl.innerHTML = '<p class="no-data-text">各タブでステータスを設定すると、ここにすべての合計値がリアルタイムで一斉合算されます。</p>';
        return;
    }

    // 🌟 5. 3大要素が完全に折り重なった「真の総合計ステータスカード」をダメージ計算機の上部へ一斉描画！
    let html = "";
    for (let typeName in finalMergedTotals) {
        const item = finalMergedTotals[typeName];
        const unit = item.is_percent ? "%" : "";
        const formattedVal = Math.round(item.value * 100) / 100;
        
        if (formattedVal > 0) {
            html += `
                <div class="summary-card" style="border-left: 4px solid #e53e3e; background:#ffffff;">
                    <div class="card-status-name" style="font-weight:bold; color:#4a5568;">${typeName}</div>
                    <div class="card-status-value" style="color:#e53e3e;">+${formattedVal}${unit}</div>
                </div>
            `;
        }
    }
    displayEl.innerHTML = html;
}

// ==========================================================================
// 全タブ総合計ステータス ➔ ダメージ計算機フォーム全自動流し込みエンジン
// ==========================================================================
function setInputValue(id, val) {
    const el = document.getElementById(id);
    if (!el) return;

    // 小数点2桁に丸める
    el.value = Math.round(val * 100) / 100;
}

function applyMergedTotalToDamageFields(buildType) {
    // ============================================================
    // ① フォーム初期化（前の値が残らないようにする）
    // ============================================================
    const targetSideRadio = document.querySelector('input[name="calcPositionMode"]:checked');
    const targetSide = targetSideRadio ? targetSideRadio.value : "src";

    clearDamageFieldsBySelection();

    // ============================================================
    // ② summary-card をスキャンして mergedTotals を作る
    // ============================================================
    const mergeGrid = document.getElementById("damageTotalSummaryDisplay");
    if (!mergeGrid) return;

    const cards = mergeGrid.getElementsByClassName("summary-card");
    let mergedTotals = {};

    Array.from(cards).forEach(card => {
        const nameEl = card.querySelector(".card-status-name");
        const valEl = card.querySelector(".card-status-value");
        if (!nameEl || !valEl) return;

        const name = nameEl.textContent.trim().replace('%', '');
        const val = parseFloat(valEl.textContent.replace('+', '').replace('%', '')) || 0;

        mergedTotals[name] = (mergedTotals[name] || 0) + val;
    });

    // ============================================================
    // ③ buildType（物理／魔法）で流し込み分岐
    // ============================================================
    const getStat = (name) => mergedTotals[name] || 0;

    if (targetSide === "src") {

        // CRIダメージ
        setInputValue("calc_criDmg", 200 + getStat("CRIダメージ"));

        if (buildType === "physical") {
            const real = getStat("物理貫通");
            const percent = getStat("最終物理貫通");
            const conv = real > 0 ? -2.5 + 0.5 * Math.sqrt(9 + 8 * real) : 0;
            setInputValue("calc_pen", percent + conv);

            setInputValue("calc_atkPercent", getStat("物理増強"));
            setInputValue("calc_finAtkPercent", getStat("最終物理増強"));
            setInputValue("calc_pvpAtkReal", getStat("PVP物理増強"));
            setInputValue("calc_pvpAtkPercent", getStat("PVP最終物理増強"));
        }

        if (buildType === "magic") {
            const real = getStat("魔法貫通");
            const percent = getStat("最終魔法貫通");
            const conv = real > 0 ? -2.5 + 0.5 * Math.sqrt(9 + 8 * real) : 0;
            setInputValue("calc_pen", percent + conv);

            setInputValue("calc_atkPercent", getStat("魔法増強"));
            setInputValue("calc_finAtkPercent", getStat("最終魔法増強"));
            setInputValue("calc_pvpAtkReal", getStat("PVP魔法増強"));
            setInputValue("calc_pvpAtkPercent", getStat("PVP最終魔法増強"));
        }

        // 共通
        setInputValue("calc_monsterDamage", getStat("人間形モンスターダメージ増加"));
        setInputValue("calc_attrDmg", getStat("属性強化"));
        setInputValue("calc_sizeDamage", getStat("中型モンスターダメージ増加"));
        setInputValue("calc_dmgUp", getStat("属性モンスターダメージ増加"));
        setInputValue("calc_finDmgUp", getStat("最終ダメージ増加"));
    }

    else {

        if (buildType === "physical") {
            setInputValue("calc_defPercent", getStat("最終物理防御"));
            setInputValue("calc_defRealPercent", getStat("物理ダメージ軽減"));
            setInputValue("calc_finAtkRes", getStat("最終物理ダメージ軽減"));
            setInputValue("calc_pvpDefReal", getStat("PVP物理ダメージ軽減"));
            setInputValue("calc_pvpDefPercent", getStat("PVP最終物理ダメージ軽減"));
        }

        if (buildType === "magic") {
            setInputValue("calc_defPercent", getStat("最終魔法防御"));
            setInputValue("calc_defRealPercent", getStat("魔法ダメージ軽減"));
            setInputValue("calc_finAtkRes", getStat("最終魔法ダメージ軽減"));
            setInputValue("calc_pvpDefReal", getStat("PVP魔法ダメージ軽減"));
            setInputValue("calc_pvpDefPercent", getStat("PVP最終魔法ダメージ軽減"));
        }
        // 共通
        setInputValue("calc_criRes", getStat("CRIダメージ軽減"));
        setInputValue("calc_monsterRes", getStat("人間形モンスターダメージ軽減"));
        setInputValue("calc_attrRes", getStat("属性耐性"));
        setInputValue("calc_sizeRes", getStat("中型モンスターダメージ軽減"));
        setInputValue("calc_finDmgRes", getStat("最終ダメージ軽減"));
    }

    // ============================================================
    // ④ ダメージ計算再実行
    // ============================================================
    if (typeof calculateDamage === 'function') calculateDamage();

    const modeText = (buildType === 'physical') ? "物理職用" : "魔法職用";
    const sideText = (targetSide === "src") ? "⚔️ 攻撃側 (あなた)" : "🛡️ 防御側 (ターゲット)";
    
    alert(`総合計から ${modeText} のステータスを反映しました！`);
}


// 3. 🗑️「入力を初期化」ボタンが押された時に、選ばれているターゲット側のフォームを初期ベース値へ戻す関数
function clearDamageFieldsBySelection() {
    const targetSideRadio = document.querySelector('input[name="calcPositionMode"]:checked');
    const targetSide = targetSideRadio ? targetSideRadio.value : "src";

    // 攻撃側の calc_* 一覧
    const attackFields = {
        calc_atk: 10000,
        calc_criDmg: 200,
        calc_attrFactor: 100,
        calc_sizeFactor: 100,
        calc_skillFactor: 100,

        // その他は 0
        calc_pen: 0,
        calc_atkPercent: 0,
        calc_finAtkPercent: 0,
        calc_monsterDamage: 0,
        calc_attrDmg: 0,
        calc_sizeDamage: 0,
        calc_dmgUp: 0,
        calc_finDmgUp: 0,
        calc_pvpAtkReal: 0,
        calc_pvpAtkPercent: 0
    };

    // 防御側の calc_* 一覧（全部 0）
    const defenseFields = {
        calc_defPercent: 0,
        calc_criRes: 0,
        calc_defRealPercent: 0,
        calc_finAtkRes: 0,
        calc_monsterRes: 0,
        calc_attrRes: 0,
        calc_sizeRes: 0,
        calc_finDmgRes: 0,
        calc_pvpDefReal: 0,
        calc_pvpDefPercent: 0
    };

    const fields = (targetSide === "src") ? attackFields : defenseFields;

    // 実際に初期化する
    for (let id in fields) {
        const el = document.getElementById(id);
        if (el) el.value = fields[id];
    }

    if (typeof calculateDamage === 'function') {
        calculateDamage();
    }
}
