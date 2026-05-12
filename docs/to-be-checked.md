# To Be Checked

実裝過程で判斷した決定事項・未解決事項の記録。

---

## [要確認] Node.js バージョン ≥ 18 必須

**狀況**: 現在の実行環境は Node.js v16.15.0 だが、Vite 5 / Vitest 2 / Svelte 5 / Playwright は Node.js ≥ 18 を要求する。  
`npm install` は警告付きで完了するが、`npm run dev` / `npm test` を実行すると `crypto.getRandomValues is not a function` エラーになる。

**対応**: `package.json` に `"engines": { "node": ">=18" }` を追記。  
**アクション**: Node.js 18 LTS 以上にアップグレードしてから `npm run dev` や `npm test` を実行すること。

---

## [決定] Svelte 5（Runes）を採用

**理由**: `CLAUDE.md` が `src/stores/order.svelte.ts` という拡張子を指定しており、これは Svelte 5 の Runes ベース reactive store 専用の書き方。Svelte 4 では `.svelte.ts` は通常使用しない。

**影響**: 
- `@sveltejs/vite-plugin-svelte` は v4 を使用（Svelte 5 対応）
- `@testing-library/svelte` は v5 を使用（Svelte 5 対応）
- コンポーネント内は `$state`, `$derived`, `$props`, `$bindable` を使用

---

## [決定] Tailwind CSS v3 を採用（v4 ではなく）

**理由**: `docs/process.md` に `tailwind.config.js` / `postcss.config.js` を記載しており、これは v3 の設定ファイル構成。v4 は `@import "tailwindcss"` のみで設定ファイル不要だが、v3 の方が Svelte との実績が多く安定している。

---

## [決定] `vitest.config.ts` を `vite.config.ts` と分離

**理由**: `vite.config.ts` はビルド専用、`vitest.config.ts` はテスト専用に分けることで責務が明確になる。  
`vitest.config.ts` は `vitest/config` の `defineConfig` を使い、Svelte プラグインの HMR を無効化（`hot: !process.env.VITEST`）している。

---

## [決定] order store に `clear()` メソッドを追加

**理由**: `CLAUDE.md` の仕様には含まれないが、コンポーネントテストの `beforeEach` でモジュールレベルの `$state` をリセットするために必要。テスト間の状態汚染を防ぐ。

---

## [決定] E2E は CI 時に production build（`preview`）でテスト、ローカルは dev server

**理由**: CI では本番ビルドを検証すべきだが、ローカルでは毎回ビルドする手間を省くため。`playwright.config.ts` で `process.env.CI` を判定して切り替えている。
- CI: `npm run build && npm run preview` → port 4173
- ローカル: `npm run dev` → port 5173

---

## [決定] `scaleValue()` を nutrition.ts に追加

**理由**: SelectedList で「数量 × 栄養値」を表示する際、`null` 値を `'-'` で扱い、小数点 1 桁で丸める処理が必要。`formatValue()` は単一値用なので、スケール版を別関数で実装。

---

## [決定] MenuItemCard に「繊維」フィールドを表示

**理由**: `CLAUDE.md` の「顯示項目」に食物繊維が明示されているため、カード（一覧）にも表示する。drink カテゴリは `dietary_fiber: null` なので `'-'` 表示になり、null 表示の検証ポイントになる。

---

## [決定] `tsconfig.json` に `skipLibCheck: true` を追加

**理由**: Playwright / Vitest / @testing-library/jest-dom 等の型定義が `@types/node` を必要とする一方、ブラウザ向けアプリには不要。`skipLibCheck` で node_modules 内の型エラーを無視することで、アプリ側のコードだけを typecheck 対象にできる。

---

## [未解決] `npm run test` の実行確認ができていない

**理由**: 現環境の Node.js が v16 のため Vitest が起動できず、unit / component テストの pass/fail を確認できていない。  
**アクション**: Node.js 18+ 環境で `npm test` と `npm run test:e2e` を実行して確認すること。
