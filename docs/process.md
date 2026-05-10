# 實裝過程

## 環境設置

- [ ] 初始化 `package.json`（Svelte、Vite、TypeScript、Tailwind CSS、Vitest、Playwright）
- [ ] 設置 `vite.config.ts`、`svelte.config.js`、`tsconfig.json`
- [ ] 設置 Tailwind CSS（`tailwind.config.js`、`postcss.config.js`）
- [ ] 設置 Vitest（`vitest.config.ts` 或合併進 vite config）
- [ ] 設置 Playwright（`playwright.config.ts`）

## 資料層

- [ ] 定義 TypeScript 型別（`src/types.ts`）：`MenuItem`、`NutritionValue`、`Locale`
- [ ] 實裝 JSON adapter（`src/lib/nutrition.ts`）：將 `nutrition.json` 的 flat 欄位轉換為 `MenuItem`
- [ ] 實裝純函數計算邏輯（`src/lib/nutrition.ts`）：`calcTotal()`、`formatValue()`
- [ ] 實裝 i18n（`src/lib/i18n.ts`）：ja/en label maps + `t()` helper

## 狀態管理

- [ ] 實裝購物車 store（`src/stores/order.svelte.ts`）：已選餐點 + 數量管理

## UI 元件

- [ ] 實裝 `LanguageToggle.svelte`：ja ↔ en 切換按鈕
- [ ] 實裝 `CategoryTabs.svelte`：Chicken / Burger / Sides / Drink 分類標籤
- [ ] 實裝 `MenuItemCard.svelte`：單一餐點（名稱、營養數值、數量控制）
- [ ] 實裝 `MenuList.svelte`：捲動式餐點列表（依分類過濾）
- [ ] 實裝 `SelectedList.svelte`：已選餐點列表（含各別營養數值）
- [ ] 實裝 `TotalRow.svelte`：已選餐點的即時總計列
- [ ] 實裝 `App.svelte`：整合所有元件、語言切換狀態
- [ ] 實裝 `main.ts`：掛載 App 入口點

## 測試

- [ ] 撰寫 Unit Tests（`tests/unit/nutrition.test.ts`）：`calcTotal()` 邊界情況、JSON 資料完整性
- [ ] 撰寫 Component Tests（`tests/component/MenuItemCard.test.ts`）：缺少資料顯示 `-`、選取/取消行為
- [ ] 撰寫 E2E Tests（`tests/e2e/flow.spec.ts`）：完整使用者流程、語言切換

## CI/CD

- [ ] 設置 GitHub Actions（`.github/workflows/ci.yml`）：unit → component → e2e → deploy
- [ ] 設置 Cloudflare Pages 自動部署（測試全通過後觸發）
