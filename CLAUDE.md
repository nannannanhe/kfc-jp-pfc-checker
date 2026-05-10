# CLAUDE.md

## Project Overview

- **名稱**: KFC Japan PFC Calculator
- **目的**: 日本肯德基菜單的營養成分（PFC）計算器
- **Tech Stack**: Svelte + Vite + TypeScript + Tailwind CSS
- **形式**: 單頁式 Web App（SPA）

## Features

### 菜單分類

- Chicken
- Burger
- Sides
- Drink

### 使用者操作

- 從各分類中點選餐點，加入計算對象
  - 各餐點皆可選擇複數(ex: 點兩塊炸雞)
- 可取消已選取的餐點
- 切換 UI 語言（日文 / 英文）
  - 日文模式：顯示日文餐點名稱與標籤
  - 英文模式：顯示 name_en 與英文標籤

### 營養資料顯示

- 顯示項目: カロリー（kcal）、炭水化物、タンパク質、脂質、食物繊維
- 各別顯示每道餐點的數值
- 即時顯示所有已選餐點的總計
- 缺少資料的欄位顯示 `-`（不影響總計，以零計算）

### 資料來源

- 已從官方公佈的 PDF 取得 PFC 資料，整理後以 JSON 儲存於專案內
  - 原始PDF存於data/raw
  - JSON檔: data/nutrition.json

## Data Structure

```typescript
type NutritionValue = number | null; // null = 資料未公佈

interface MenuItem {
  id: string;
  name: string;
  name_en: string;
  category: "burger" | "chicken" | "sides" | "drink";
  nutrition: {
    calories: NutritionValue; // kcal
    carbs: NutritionValue; // 炭水化物 g
    protein: NutritionValue; // タンパク質 g
    fat: NutritionValue; // 脂質 g
    fiber: NutritionValue; // 食物繊維 g
  };
}
```

`data/nutrition.json` の flat フィールドを MenuItem へ変換する adapter は `src/lib/nutrition.ts` に実装する：

| JSON フィールド  | MenuItem フィールド      |
| --------------- | ----------------------- |
| `energy`        | `nutrition.calories`    |
| `carbohydrate`  | `nutrition.carbs`       |
| `dietary_fiber` | `nutrition.fiber`       |

`id` は `name_en` を kebab-case に変換して生成する（例: `"original-recipe-chicken"`）。

## Code Conventions

- 語言: TypeScript（strict mode）
- 縮排: 2 spaces
- 命名: コンポーネント PascalCase / 関数・変数 camelCase / ファイル kebab-case
- `null` は「データ未公開」を意味する。`undefined` と混在させない
- 計算ロジックは純粋関数として `src/lib/nutrition.ts` に集約する
- コンポーネントに計算ロジックを直接書かない

## Code Style

- 可讀性優先，避免過度抽象
- 簡潔優先，不寫不必要的註解
- 元件保持小而專一

## Testing Strategy

### Unit Tests — Vitest

計算邏輯與資料處理：

- `calcTotal()`: null 值以零計、空陣列、正常加總
- JSON 資料完整性: 每筆餐點都有 `id`、`name`、`calories`，數值不為負數

### Component Tests — Vitest + @testing-library/svelte

UI 元件行為：

- 缺少資料的欄位正確顯示 `-`
- 選取餐點後出現在已選清單
- 取消選取後從清單移除

### E2E Tests — Playwright

完整使用者流程：

- 頁面正常載入，四個分類選單都顯示
- 點選餐點 → 出現在已選清單 → 總計更新
- 取消選取 → 從清單移除 → 總計正確扣除
- 含缺少資料的餐點 → 對應欄位顯示 `-` → 總計不受影響

## CI/CD

- **GitHub Actions**: push 後依序執行 unit → component → E2E 測試
- **Deploy 條件**: 全部測試通過後，自動 deploy 到 Cloudflare Pages
- **E2E は deploy の gate**（失敗した場合は deploy しない）

## Project Structure

```
src/
├── main.ts
├── App.svelte
├── types.ts                    # MenuItem, NutritionValue, Locale
├── lib/
│   ├── nutrition.ts            # JSON adapter + pure calc (calcTotal, formatValue)
│   └── i18n.ts                 # ja/en label maps + t() helper
├── stores/
│   └── order.svelte.ts         # selected items + quantities (writable store)
└── components/
    ├── LanguageToggle.svelte   # ja/en switch button
    ├── CategoryTabs.svelte     # tab bar for 4 categories
    ├── MenuList.svelte         # scrollable list of items per category
    ├── MenuItemCard.svelte     # single item: name + nutrition + qty control
    ├── SelectedList.svelte     # list of selected items with per-item nutrition
    └── TotalRow.svelte         # grand total row

data/
├── nutrition.json              # source data (flat fields, from PDF)
└── raw/                        # gitignored PDF sources

tests/
├── unit/
│   └── nutrition.test.ts
├── component/
│   └── MenuItemCard.test.ts
└── e2e/
    └── flow.spec.ts

.github/
└── workflows/
    └── ci.yml                  # unit → component → e2e → deploy
```

## Commands

```bash
npm run dev          # Vite dev server (http://localhost:5173)
npm run build        # TypeScript check + Vite production build
npm run preview      # Preview production build locally
npm run test         # Vitest — unit + component tests
npm run test:e2e     # Playwright E2E tests
npm run typecheck    # tsc --noEmit
```
