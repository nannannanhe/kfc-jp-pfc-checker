# 實裝過程

## 環境設置

- [x] 初始化 `package.json`（Svelte、Vite、TypeScript、Tailwind CSS、Vitest、Playwright）
- [x] 設置 `vite.config.ts`、`svelte.config.js`、`tsconfig.json`
- [x] 設置 Tailwind CSS（`tailwind.config.js`、`postcss.config.js`）
- [x] 設置 Vitest（`vitest.config.ts` 或合併進 vite config）
- [x] 設置 Playwright（`playwright.config.ts`）

## 資料層

- [x] 定義 TypeScript 型別（`src/types.ts`）：`MenuItem`、`NutritionValue`、`Locale`
- [x] 實裝 JSON adapter（`src/lib/nutrition.ts`）：將 `nutrition.json` 的 flat 欄位轉換為 `MenuItem`
- [x] 實裝純函數計算邏輯（`src/lib/nutrition.ts`）：`calcTotal()`、`formatValue()`
- [x] 實裝 i18n（`src/lib/i18n.ts`）：ja/en label maps + `getCategoryLabel()` helper

## 狀態管理

- [x] 實裝購物車 store（`src/stores/order.svelte.ts`）：已選餐點 + 數量管理

## UI 元件

- [x] 實裝 `LanguageToggle.svelte`：ja ↔ en 切換按鈕
- [x] 實裝 `CategoryTabs.svelte`：Chicken / Burger / Sides / Drink 分類標籤
- [x] 實裝 `MenuItemCard.svelte`：單一餐點（名稱、營養數值、數量控制）
- [x] 實裝 `MenuList.svelte`：捲動式餐點列表（依分類過濾）
- [x] 實裝 `SelectedList.svelte`：已選餐點列表（含各別營養數值）
- [x] 實裝 `TotalRow.svelte`：已選餐點的即時總計列
- [x] 實裝 `App.svelte`：整合所有元件、語言切換狀態
- [x] 實裝 `main.ts`：掛載 App 入口點

## 測試

- [x] 撰寫 Unit Tests（`tests/unit/nutrition.test.ts`）：`calcTotal()` 邊界情況、JSON 資料完整性
- [x] 撰寫 Component Tests（`tests/component/MenuItemCard.test.ts`）：缺少資料顯示 `-`、選取/取消行為
- [x] 撰寫 E2E Tests（`tests/e2e/flow.spec.ts`）：完整使用者流程、語言切換
- [ ] Node.js ≥ 18 環境で `npm test` 実行確認（現環境 v16 のため未実行）
- [ ] Node.js ≥ 18 環境で `npm run test:e2e` 実行確認

## CI/CD

- [x] 設置 GitHub Actions（`.github/workflows/ci.yml`）：unit → component → e2e → deploy
- [ ] Cloudflare Pages の `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` を GitHub Secrets に登録
