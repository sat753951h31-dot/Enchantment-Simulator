const slots = {
    oneHand: { id: "oneHand", apiKey: "片手武器" },
    subWeapon: { id: "subWeapon", apiKey: "サブ武器" },
    twoHand: { id: "twoHand", apiKey: "両手武器" },
    armor: { id: "armor", apiKey: "防具" },
    shoulder: { id: "shoulder", apiKey: "防具" },
    foot: { id: "foot", apiKey: "防具" },
    accLeft: { id: "accLeft", apiKey: "裝飾" },
    accRight: { id: "accRight", apiKey: "裝飾" },
    talisman: { id: "talisman", apiKey: "裝飾" }
};

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

    syncEnchantToInputs(); 
}


function toggleWeaponMode() {
    const isOneHand = document.getElementById("weaponMode1").checked;
    
    subIndices.forEach(num => {
        const gEl = document.getElementById(`grade_oneHand_${num}`); if(gEl) gEl.disabled = !isOneHand;
        const lEl = document.getElementById(`level_oneHand_${num}`); if(lEl) lEl.disabled = !isOneHand;
        const sEl = document.getElementById(`status_oneHand_${num}`); if(sEl) sEl.disabled = !isOneHand;
        
        const gsEl = document.getElementById(`grade_subWeapon_${num}`); if(gsEl) gsEl.disabled = !isOneHand;
        const lsEl = document.getElementById(`level_subWeapon_${num}`); if(lsEl) lsEl.disabled = !isOneHand;
        const ssEl = document.getElementById(`status_subWeapon_${num}`); if(ssEl) ssEl.disabled = !isOneHand;
        
        const gtEl = document.getElementById(`grade_twoHand_${num}`); if(gtEl) gtEl.disabled = isOneHand;
        const ltEl = document.getElementById(`level_twoHand_${num}`); if(ltEl) ltEl.disabled = isOneHand;
        const stEl = document.getElementById(`status_twoHand_${num}`); if(stEl) stEl.disabled = isOneHand;
    });

    document.querySelectorAll(".row-oneHand").forEach(el => el.classList.toggle("disabled-row", !isOneHand));
    for (let i = 1; i <= 3; i++) {
        const rowOne = document.getElementById(`row_oneHand_${i}`); 
        if (rowOne) rowOne.classList.toggle("disabled-row", !isOneHand);

        const rowSub = document.getElementById(`row_subWeapon_${i}`); 
        if (rowSub) rowSub.classList.toggle("disabled-row", !isOneHand);

        const rowTwo = document.getElementById(`row_twoHand_${i}`); 
        if (rowTwo) rowTwo.classList.toggle("disabled-row", isOneHand);
    }

    calculateAll();
}

function calculateAll() {
    const isOneHandMode = document.getElementById("weaponMode1").checked;
    
    // 覚醒倍率（例: 0.5 なら 1.5倍）
    const awakeLevelEl = document.getElementById("awakeningLevel");
    const awakeBonusRate = awakeLevelEl ? parseFloat(awakeLevelEl.value) : 0;
    const totalMultiplier = 1 + awakeBonusRate;

    let totals = {};

    for (let key in slots) {
        const slot = slots[key];

        if (slot.id === "twoHand" && isOneHandMode) {
            subIndices.forEach(num => {
                const el = document.getElementById(`result_${slot.id}_${num}`);
                if(el) el.textContent = "-";
            });
            continue;
        }
        if ((slot.id === "oneHand" || slot.id === "subWeapon") && !isOneHandMode) {
            subIndices.forEach(num => {
                const el = document.getElementById(`result_${slot.id}_${num}`);
                if(el) el.textContent = "-";
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

            const city = statusCityMap[slot.apiKey]?.[status];
            if (!city) {
                resultEl.textContent = "エラー";
                return;
            }

            try {
                const val = enchantMaster[city][slot.apiKey][status][level][grade];
                if (val !== undefined && val !== "") {
                    const isPercent = val.toString().includes('%');
                    const numValue = parseFloat(val.toString().replace('%', ''));

                    // 1マスごとの表示用（個別の表示は四捨五入で表示）
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

        finalTotals[statusName] = {
            value: finalValue,
            isPercent: item.isPercent
        };
    }

    updateTotalSummary(finalTotals);
}

function updateTotalSummary(totals) {
    const summaryDivBot = document.getElementById("totalSummary");
    const summaryDivTop = document.getElementById("totalSummary_top");

    // データが何も選択されていない場合の処理
    if (Object.keys(totals).length === 0) {
        const noDataHtml = '<p class="no-data-text">装備のステータスを選択すると、ここに合計がリアルタイムで集計されます。</p>';
        if (summaryDivBot) summaryDivBot.innerHTML = noDataHtml;
        if (summaryDivTop) summaryDivTop.innerHTML = noDataHtml;
        syncEnchantToInputs(); 
        return;
    }

    // 選択されたデータからHTMLカード群（STR% などのブロック）を作成
    let cardHtml = "";
    for (let statusName in totals) {
        const item = totals[statusName];
        const finalValue = Math.round(item.value * 100) / 100;
        const unit = item.isPercent ? "%" : "";

        cardHtml += `
            <div class="summary-card">
                <div class="card-status-name">${statusName}</div>
                <div class="card-status-value">+${finalValue}${unit}</div>
            </div>
        `;
    }

    // 合計カード群を、下部と上部の「両方」へ同時に一斉描画
    if (summaryDivBot) summaryDivBot.innerHTML = cardHtml;
    if (summaryDivTop) summaryDivTop.innerHTML = cardHtml;
    
    //syncEnchantToInputs();
}


function saveCurrentPlan() {
    const planNameInput = document.getElementById("planNameInput");
    const planName = planNameInput ? planNameInput.value.trim() : "";
    if (!planName) {
        alert("プラン名を入力してください。");
        return;
    }

    let planData = {
        isOneHand: document.getElementById("weaponMode1").checked,
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
    
    if (planNameInput) planNameInput.value = "";
    alert(`プラン「${planName}」を保存しました！`);
    updateSavedPlansDropdown_all();
    document.getElementById("savedPlansSelect").value = planName;
}

function updateSavedPlansDropdown() {
    const select = document.getElementById("savedPlansSelect");
    if (!select) return;
    select.innerHTML = '<option value="">-- プランを選択 --</option>';

    const savedPlans = JSON.parse(localStorage.getItem("rox_enchant_plans")) || {};
    for (let planName in savedPlans) {
        let opt = document.createElement("option");
        opt.value = planName;
        opt.textContent = planName;
        select.appendChild(opt);
    }
}

function loadSelectedPlan() {
    const planName = document.getElementById("savedPlansSelect").value;
    if (!planName) return;

    const savedPlans = JSON.parse(localStorage.getItem("rox_enchant_plans")) || {};
    const plan = savedPlans[planName];
    if (!plan) return;

    // ラジオボタンの復元
    document.getElementById("weaponMode1").checked = plan.isOneHand;
    document.getElementById("weaponMode2").checked = !plan.isOneHand;
    toggleWeaponMode(); // モードに合わせて活性・非活性を自動反映

    // 覚醒レベルの復元
    document.getElementById("awakeningLevel").value = plan.awakeningLevel;

    // 各スロット（全27枠）の選択状態を復元
    for (let id in plan.selections) {
        subIndices.forEach(num => {
            const item = plan.selections[id][num];
            if (!item) return;
            
            const statusEl = document.getElementById(`status_${id}_${num}`);
            if (statusEl) statusEl.value = item.status || "";
            
            const lvlEl = document.getElementById(`level_${id}_${num}`);
            if (lvlEl) lvlEl.value = item.level || "Lv16";
            
            const grdEl = document.getElementById(`grade_${id}_${num}`);
            if (grdEl) grdEl.value = item.grade || "白";
        });
    }

    calculateAll();
}

function deleteSelectedPlan() {
    const select = document.getElementById("savedPlansSelect");
    const planName = select ? select.value : "";
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
// ⚔️ ダメージ計算機 連動・ロジック処理
// ==========================================================================
function syncEnchantToInputs() {

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

    // 各エンチャントデータの集計器
    let enc = {
        penPercent: 0, criDmgPercent: 0, atkReal: 0, atkPercent: 0, finAtkPercent: 0, 
        monsterDamage: 0, sizeDamage: 0, finDmgUp: 0, attrDmg: 0, 
        pvpAtkReal: 0, pvpAtkPercent: 0, defPercent: 0, criRes: 0, 
        defRealPercent: 0, finAtkRes: 0, monsterRes: 0, sizeRes: 0, 
        finDmgRes: 0, attrRes: 0, pvpDefReal: 0, pvpDefPercent: 0
    };

    // 上部の「エンチャントステータス総合計」に集計されている数値を全スキャン
    const cards = document.querySelectorAll("#totalSummary .summary-card");
    cards.forEach(card => {
        const name = card.querySelector(".card-status-name").textContent.trim();
        const valStr = card.querySelector(".card-status-value").textContent;
        const val = parseFloat(valStr.replace('+', '').replace('%', '')) || 0;
        
        // 攻撃側・防御側すべてのエンチャントステータスを一旦変数にまとめる
        if (name.includes("PVP最終物理増強") || name.includes("PVP最終魔法増強")) enc.pvpAtkPercent += val; 
        else if (name.includes("PVP最終物理ダメージ軽減%") || name.includes("PVP最終魔法ダメージ軽減%")) enc.pvpDefPercent += val; 
        else if (name.includes("PVP物理ダメージ軽減") || name.includes("PVP魔法ダメージ軽減")) enc.pvpDefReal += val; 
        else if (name.includes("PVP物理増強") || name.includes("PVP魔法増強")) enc.pvpAtkReal += val; 
        
        else if (name.includes("最終貫通%")) enc.penPercent += val;
        else if (name.includes("CRIダメージ軽減")) enc.criRes += val; 
        else if (name.includes("CRIダメージ")) enc.criDmgPercent += val;
        else if (name.includes("攻撃%")) enc.atkPercent += val;
        else if (name.includes("最終物理増強") || name.includes("最終魔法増強")) enc.finAtkPercent += val; 
        else if (name.includes("物理増強") || name.includes("魔法増強")) enc.atkReal += val; 
        
        else if (name.includes("中型モンスターダメージ増加") || name.includes("サイズダメージ増加")) enc.sizeDamage += val; 
        else if (name.includes("人間形モンスターダメージ増加") || name.includes("種族ダメージ増加")) enc.monsterDamage += val;
        else if (name.includes("最終ダメージ増加%")) enc.finDmgUp += val;
        else if (name.includes("属性強化")) enc.attrDmg += val;
        
        else if (name.includes("最終物理ダメージ軽減%") || name.includes("最終魔法ダメージ軽減%")) enc.finAtkRes += val; 
        else if (name.includes("物理ダメージ軽減") || name.includes("魔法ダメージ軽減")) enc.defRealPercent += val; 
        else if (name.includes("中型モンスターダメージ軽減") || name.includes("サイズ軽減")) enc.sizeRes += val;
        else if (name.includes("人間形モンスターダメージ軽減") || name.includes("種族被ダメージ軽減")) enc.monsterRes += val;
        else if (name.includes("最終ダメージ軽減%")) enc.finDmgRes += val; 
        else if (name.includes("属性耐性")) enc.attrRes += val;
    });

    const updateInput = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = Math.round(value * 100) / 100;
    };
    
    // 🎭 ラジオボタンの設定モードによって流し込み先（連動先）のボックスを完全に分ける
    if (isSrcMode) {
        // 【攻撃側モード】自分のエンチャント合計値は左側（攻撃側）のインプットへ同期
        updateInput("calc_pen", enc.penPercent);
        updateInput("calc_criDmg", 200 + enc.criDmgPercent);
        updateInput("calc_atkPercent", enc.atkPercent);
        updateInput("calc_finAtkPercent", enc.finAtkPercent);
        updateInput("calc_monsterDamage", enc.monsterDamage);
        updateInput("calc_sizeDamage", enc.sizeDamage);
        updateInput("calc_finDmgUp", enc.finDmgUp);
        updateInput("calc_attrDmg", enc.attrDmg);
        updateInput("calc_pvpAtkReal", enc.pvpAtkReal);
        updateInput("calc_pvpAtkPercent", enc.pvpAtkPercent);
    } else {
        // 【防御側モード】自分のエンチャント合計値は右側（防御側）のインプットへ同期
        updateInput("calc_defPercent", enc.finAtkRes); 
        updateInput("calc_criRes", enc.criRes);
        updateInput("calc_defRealPercent", enc.defRealPercent);
        updateInput("calc_finDmgRes", enc.finDmgRes); 
        updateInput("calc_monsterRes", enc.monsterRes);
        updateInput("calc_sizeRes", enc.sizeRes);
        updateInput("calc_attrRes", enc.attrRes);
        updateInput("calc_pvpDefReal", enc.pvpDefReal);
        updateInput("calc_pvpDefPercent", enc.pvpDefPercent);
    }

    calculateDamage();
}

function calculateDamage() {
    const getValue = (id) => parseFloat(document.getElementById(id).value) || 0;

    // 🟥 攻撃側パラメータの取得
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

    // 🟦 防御側パラメータの取得
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

    // ① 貫通 vs 防御% の相殺
    let calcFinalPhysicalPenetration = finalPhysicalPenetration - targetFinalPhysicalDefense;
    if (calcFinalPhysicalPenetration < -80) { calcFinalPhysicalPenetration = -80; }

    // ② CRIダメージ vs CRIダメージ軽減 の相殺
    let calcCriticalDamage = criticalDamage - targetCriticalDamageReduction;
    if (calcCriticalDamage < 20) { calcCriticalDamage = 20; }

    // ③ 最終物魔増強% から 最終物魔軽減% を引き算（相殺）
    let calcFinalPhysicalDamageBonus = finalPhysicalDamageBonus - targetFinalPhysicalDamageReduction;
    if (calcFinalPhysicalDamageBonus < -80) { calcFinalPhysicalDamageBonus = -80; }

    // ④ 種族（モンスター）の相殺
    let calcRaceBonus = raceBonus - targetRaceReduction;
    if (calcRaceBonus < -80) { calcRaceBonus = -80; }

    // ⑤ 属性相性・強化の計算
    let calcElementEnhance = elementCounter + elementBonus - targetElementResistance;
    if (calcElementEnhance < 20) { calcElementEnhance = 20; }

    // ⑥ サイズ補正・増加の相殺
    let calcSizeEnhance = sizeModifier + sizeEnhance - targetSizeReduction;
    if (calcSizeEnhance < 20) { calcSizeEnhance = 20; }

    // ⑦ 最終ダメージ増加 vs 最終ダメージ軽減 の相殺
    let calcFinalDamageBonus = finalDamageBonus - targetFinalDamageReduction;
    if (calcFinalDamageBonus < -80) { calcFinalDamageBonus = -80; }

    // ⑧ PVP最終増強 vs PVP最終軽減 の相殺
    let calcPvpFinalPhysicalDamageBonus = pvpFinalPhysicalDamageBonus - targetPvpFinalPhysicalDamageReduction;
    if (calcPvpFinalPhysicalDamageBonus < -80) { calcPvpFinalPhysicalDamageBonus = -80; }

    // 🍀 PVE用マルチプライヤー
    let physicalDamageMultiplier = (1 + calcFinalPhysicalDamageBonus / 100) * 
                                   (calcElementEnhance / 100) * 
                                   (1 + calcRaceBonus / 100) * 
                                   (1 + calcFinalDamageBonus / 100) * 
                                   (calcSizeEnhance / 100) * 
                                   (1 + skillDamageBonus / 100);

    // ==========================================
    // 🍀 一般モンスター (PvE) ダメージ計算
    // ==========================================
    const normalPhysicalDamage = Math.floor(physicalAttack * (1 + calcFinalPhysicalPenetration / 100) + (physicalDamageBonus - targetPhysicalDamageReduction)) * physicalDamageMultiplier;
    const criticalPhysicalDamage = Math.floor(physicalAttack * (calcCriticalDamage / 100) + (physicalDamageBonus - targetPhysicalDamageReduction)) * physicalDamageMultiplier;

    // スキル通常ダメージ
    const normalSkillPhysicalDamage = Math.floor(((skillMultiplier / 100) * physicalAttack + skillAddition) * (1 + calcFinalPhysicalPenetration / 100) + (physicalDamageBonus - targetPhysicalDamageReduction)) * physicalDamageMultiplier;
    
    // スキルクリティカルダメージ
    const criticalSkillPhysicalDamage = Math.floor(((skillMultiplier / 100) * physicalAttack + skillAddition) * (calcCriticalDamage / 100) + (physicalDamageBonus - targetPhysicalDamageReduction)) * physicalDamageMultiplier;

    // ==========================================
    // ⚔️ 対人戦 (PvP) ダメージ計算 (累乗減衰)
    // ==========================================
    let pvpDamageMultiplier = physicalDamageMultiplier * (1 + calcPvpFinalPhysicalDamageBonus / 100);

    // PvP 通常攻撃
    let pvpNormalPhysicalDamageBase = (8 * (normalPhysicalDamage > 0 ? normalPhysicalDamage : 0) ** 0.6 + pvpPhysicalDamageBonus - targetPvpPhysicalDamageReduction);
    if (pvpNormalPhysicalDamageBase < 0) { pvpNormalPhysicalDamageBase = 0; }
    const pvpNormalPhysicalDamage = pvpNormalPhysicalDamageBase * (1 + calcPvpFinalPhysicalDamageBonus / 100);

    // PvP クリティカル
    let pvpCriticalPhysicalDamageBase = (8 * (criticalPhysicalDamage > 0 ? criticalPhysicalDamage : 0) ** 0.6 + pvpPhysicalDamageBonus - targetPvpPhysicalDamageReduction);
    if (pvpCriticalPhysicalDamageBase < 0) { pvpCriticalPhysicalDamageBase = 0; }
    const pvpCriticalPhysicalDamage = pvpCriticalPhysicalDamageBase * (1 + calcPvpFinalPhysicalDamageBonus / 100);

    // PvP スキル攻撃
    let pvpNormalSkillPhysicalDamageBase = (16 * (normalSkillPhysicalDamage > 0 ? normalSkillPhysicalDamage : 0) ** 0.6 + pvpPhysicalDamageBonus - targetPvpPhysicalDamageReduction);
    if (pvpNormalSkillPhysicalDamageBase < 0) { pvpNormalSkillPhysicalDamageBase = 0; }
    const pvpNormalSkillPhysicalDamage = pvpNormalSkillPhysicalDamageBase * (1 + calcPvpFinalPhysicalDamageBonus / 100);

    // PvP スキルクリティカル
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

    // PVE 結果描画
    draw("out_monNorm", normalPhysicalDamage);
    draw("out_monCri", criticalPhysicalDamage);
    draw("out_monSkill", normalSkillPhysicalDamage);
    draw("out_monSkillCri", criticalSkillPhysicalDamage);

    // PVP 結果描画
    draw("out_pvpNorm", pvpNormalPhysicalDamage);
    draw("out_pvpCri", pvpCriticalPhysicalDamage);
    draw("out_pvpSkill", pvpNormalSkillPhysicalDamage);
    draw("out_pvpSkillCri", pvpCriticalSkillPhysicalDamage);
}

// ==========================================================================
// 📑 タブ切り替え制御機能
// ==========================================================================
function switchTab(tabName) {
    // 全てのタブボタンとコンテンツ要素を取得
    const btnEnchant = document.getElementById("tabBtnEnchant");
    const btnDamage = document.getElementById("tabBtnDamage");
    const contentEnchant = document.getElementById("tabContentEnchant");
    const contentDamage = document.getElementById("tabContentDamage");

    if (!btnEnchant || !btnDamage || !contentEnchant || !contentDamage) return;

    if (tabName === 'enchant') {
        // エンチャントタブを活性化
        btnEnchant.classList.add("active-tab");
        btnDamage.classList.remove("active-tab");
        contentEnchant.classList.add("active-pane");
        contentDamage.classList.remove("active-pane");
    } else if (tabName === 'damage') {
        // ダメージ計算機タブを活性化
        btnEnchant.classList.remove("active-tab");
        btnDamage.classList.add("active-tab");
        contentEnchant.classList.remove("active-pane");
        contentDamage.classList.add("active-pane");
        
        // 🌟 ダメージタブを開いた瞬間に、最新のエンチャント合計値を計算機へ確実に同期させる（一旦自動化停止）
//        if (typeof syncEnchantToInputs === 'function') {
//            syncEnchantToInputs();
//        }
    }
}

// ==========================================================================
// 🔄 ダメージ計算機 入力欄の一括初期化（リセット）機能
// ==========================================================================
function resetCalculatorInputs() {
    if (!confirm("ダメージ計算機の入力欄をすべて初期状態リセットしてもよろしいですか？\n(上部のエンチャント構成データは消えません)")) return;

    const resetValue = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    };

    // 🟥 攻撃側パラメータを初期値にリセット
    resetValue("calc_atk", 10000);
    resetValue("calc_pen", 0);
    resetValue("calc_criDmg", 200);
    resetValue("calc_atkPercent", 0);
    resetValue("calc_finAtkPercent", 0);
    resetValue("calc_monsterDamage", 0);
    resetValue("calc_attrDmg", 0);
    resetValue("calc_attrFactor", 100);
    resetValue("calc_sizeFactor", 100);
    resetValue("calc_sizeDamage", 0);
    resetValue("calc_dmgUp", 0);
    resetValue("calc_finDmgUp", 0);
    resetValue("calc_pvpAtkReal", 0);
    resetValue("calc_pvpAtkPercent", 0);
    resetValue("calc_skillFactor", 100);
    resetValue("calc_skillAdd", 0);

    // 🟦 防御側パラメータを初期値にリセット
    resetValue("calc_defPercent", 0);
    resetValue("calc_criRes", 0);
    resetValue("calc_defRealPercent", 0);
    resetValue("calc_finAtkRes", 0);
    resetValue("calc_monsterRes", 0);
    resetValue("calc_attrRes", 0);
    resetValue("calc_sizeRes", 0);
    resetValue("calc_finDmgRes", 0);
    resetValue("calc_pvpDefReal", 0);
    resetValue("calc_pvpDefPercent", 0);

    // 初期化後にダメージを再計算
    calculateDamage();
    alert("計算機の入力欄を初期化しました。");
}

function switchPositionMode() {
    const modeEl = document.querySelector('input[name="calcPositionMode"]:checked');
    const isSrcMode = modeEl ? modeEl.value === "src" : true;

    // ボックスのヘッダータイトルを動的に書き換える
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

// プルダウンメニューを一斉に最新のセーブデータ一覧に更新する
function updateSavedPlansDropdown_all() {
    const selectTop = document.getElementById("savedPlansSelect_top");
    const selectBottom = document.getElementById("savedPlansSelect");
    const savedPlans = JSON.parse(localStorage.getItem("rox_enchant_plans")) || {};

    const createOptionsHtml = () => {
        let html = '<option value="">-- プランを選択 --</option>';
        for (let planName in savedPlans) {
            html += `<option value="${planName}">${planName}</option>`;
        }
        return html;
    };

    const optionsHtml = createOptionsHtml();
    if (selectTop) selectTop.innerHTML = optionsHtml;
    if (selectBottom) selectBottom.innerHTML = optionsHtml;
}

// プラン名入力欄を上下でリアルタイム同期させる
function syncSavePanelInputs(triggerSide) {
    const topInput = document.getElementById("planNameInput_top");
    const botInput = document.getElementById("planNameInput");
    if (!topInput || !botInput) return;

    if (triggerSide === 'top') {
        botInput.value = topInput.value;
    } else {
        topInput.value = botInput.value;
    }
}

// 覚醒レベルを上下で完全にリアルタイム同期させて再計算する
function syncAwakeningLevel(triggerSide) {
    const topSelect = document.getElementById("awakeningLevel_top");
    const botSelect = document.getElementById("awakeningLevel");
    if (!topSelect || !botSelect) return;

    if (triggerSide === 'top') {
        botSelect.value = topSelect.value;
    } else {
        topSelect.value = topSelect.value;
    }
    // 連動させた上でシミュレータの再計算を走らせる
    calculateAll();
}

// 現在の構成を保存する（引数でどちらのボタンが押されたか判定）
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
    
    // 入力欄をクリア
    const topInput = document.getElementById("planNameInput_top");
    const botInput = document.getElementById("planNameInput");
    if (topInput) topInput.value = "";
    if (botInput) botInput.value = "";

    alert(`プラン「${planName}」を保存しました！`);
    updateSavedPlansDropdown_all();
    
    // 上下両方の選択肢を今保存したプランに合わせる
    if (document.getElementById("savedPlansSelect_top")) document.getElementById("savedPlansSelect_top").value = planName;
    if (document.getElementById("savedPlansSelect")) document.getElementById("savedPlansSelect").value = planName;
}

// 選択したプランを画面にロード（復元）する
function loadSelectedPlan(side) {
    const suffix = side === 'top' ? '_top' : '';
    const selectEl = document.getElementById(`savedPlansSelect${suffix}`);
    if (!selectEl) return;
    const planName = selectEl.value;
    if (!planName) return;

    // もう片方のセレクトボックスの表示も同期させる
    const otherSide = side === 'top' ? '' : '_top';
    const otherSelect = document.getElementById(`savedPlansSelect${otherSide}`);
    if (otherSelect) otherSelect.value = planName;

    const savedPlans = JSON.parse(localStorage.getItem("rox_enchant_plans")) || {};
    const plan = savedPlans[planName];
    if (!plan) return;

    document.getElementById("weaponMode1").checked = plan.isOneHand;
    document.getElementById("weaponMode2").checked = !plan.isOneHand;
    toggleWeaponMode();

    // 覚醒レベルを上下両方とも復元
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

// プランを削除する
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

function resetEnchantSimulator() {
    if (!confirm("エンチャント構成をすべてリセットして初期状態に戻しますか？\n(保存済みのプランや、下のダメージ計算機の入力値は消えません)")) return;

    for (let key in slots) {
        const id = slots[key].id;
        subIndices.forEach(num => {
            const statusEl = document.getElementById(`status_${id}_${num}`);
            if (statusEl) statusEl.value = ""; // 「選択してください」に戻す
            
            const lvlEl = document.getElementById(`level_${id}_${num}`);
            if (lvlEl) lvlEl.value = "Lv16"; // 初期レベル
            
            const grdEl = document.getElementById(`grade_${id}_${num}`);
            if (grdEl) grdEl.value = "白"; // 初期グレード
        });
    }

    // 覚醒レベルのプルダウンも上下ともに初期値「なし(0)」にリセット
    if (document.getElementById("awakeningLevel_top")) document.getElementById("awakeningLevel_top").value = "0";
    if (document.getElementById("awakeningLevel")) document.getElementById("awakeningLevel").value = "0";

    // リセット完了後に全体のステータス合計値を再計算して画面を更新
    calculateAll();
    alert("すべてのエンチャントスロットを初期化しました。");
}


// ==========================================================================
// 💾 ダメージ計算機（全パラメータ環境）のセーブ・ロード・削除機能
// ==========================================================================

// 保存済み計算プランのプルダウンメニューを最新状態に更新する
function updateSavedDamagePlansDropdown() {
    const select = document.getElementById("savedDmgPlansSelect");
    if (!select) return;
    select.innerHTML = '<option value="">-- プランを選択 --</option>';

    const savedDmgPlans = JSON.parse(localStorage.getItem("rox_damage_plans")) || {};
    for (let planName in savedDmgPlans) {
        let opt = document.createElement("option");
        opt.value = planName;
        opt.textContent = planName;
        select.appendChild(opt);
    }
}

// 現在のダメージ計算機のすべての入力フォーム値を保存する
function saveDamagePlan() {
    const planNameInput = document.getElementById("dmgPlanNameInput");
    const planName = planNameInput ? planNameInput.value.trim() : "";
    if (!planName) {
        alert("計算プラン名を入力してください。");
        return;
    }

    // 画面に設置されている立場設定のラジオボタン（src か dst）の状態も一緒に保存
    const modeEl = document.querySelector('input[name="calcPositionMode"]:checked');
    
    // 全30項目のIDに対応する入力値をオブジェクトに丸ごと格納
    let damagePlanData = {
        positionMode: modeEl ? modeEl.value : "src",
        inputs: {}
    };

    // 攻撃側・防御側の全インプットIDのリスト
    const inputIds = [
        "calc_atk", "calc_pen", "calc_criDmg", "calc_atkPercent", "calc_finAtkPercent",
        "calc_monsterDamage", "calc_attrDmg", "calc_attrFactor", "calc_sizeFactor",
        "calc_sizeDamage", "calc_dmgUp", "calc_finDmgUp", "calc_pvpAtkReal", "calc_pvpAtkPercent",
        "calc_skillFactor", "calc_skillAdd",
        "calc_defPercent", "calc_criRes", "calc_defRealPercent", "calc_finAtkRes",
        "calc_monsterRes", "calc_attrRes", "calc_sizeRes", "calc_finDmgRes",
        "calc_pvpDefReal", "calc_pvpDefPercent"
    ];

    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) damagePlanData.inputs[id] = el.value;
    });

    let savedDmgPlans = JSON.parse(localStorage.getItem("rox_damage_plans")) || {};
    savedDmgPlans[planName] = damagePlanData;
    localStorage.setItem("rox_damage_plans", JSON.stringify(savedDmgPlans));
    
    if (planNameInput) planNameInput.value = "";
    alert(`計算プラン「${planName}」を保存しました！`);
    updateSavedDamagePlansDropdown();
    document.getElementById("savedDmgPlansSelect").value = planName;
}

// 選択した計算プランをロードして画面に復元する
function loadDamagePlan() {
    const planName = document.getElementById("savedDmgPlansSelect").value;
    if (!planName) return;

    const savedDmgPlans = JSON.parse(localStorage.getItem("rox_damage_plans")) || {};
    const plan = savedDmgPlans[planName];
    if (!plan) return;

    // 立場設定（ラジオボタン）の復元と、文字の表示演出切り替え
    if (plan.positionMode === "src") {
        document.getElementById("calcModeSrc").checked = true;
    } else {
        document.getElementById("calcModeDst").checked = true;
    }
    if (typeof switchPositionMode === 'function') {
        switchPositionMode();
    }

    // 全てのインプットボックスの数値を復元
    for (let id in plan.inputs) {
        const el = document.getElementById(id);
        if (el) el.value = plan.inputs[id];
    }

    // 復元完了後にダメージボードを一斉に再計算
    calculateDamage();
}

// 保存されている計算プランを削除する
function deleteDamagePlan() {
    const select = document.getElementById("savedDmgPlansSelect");
    const planName = select ? select.value : "";
    if (!planName) {
        alert("削除する計算プランを選択してください。");
        return;
    }

    if (confirm(`計算プラン「${planName}」を削除してもよろしいですか？`)) {
        let savedDmgPlans = JSON.parse(localStorage.getItem("rox_damage_plans")) || {};
        delete savedDmgPlans[planName];
        localStorage.setItem("rox_damage_plans", JSON.stringify(savedDmgPlans));
        
        updateSavedDamagePlansDropdown();
        calculateDamage();
        alert("削除しました。");
    }
}
