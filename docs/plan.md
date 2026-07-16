# Plan: GitHub Action — KFC JP Nutrition PDF 自動更新チェック

## Context

`data/nutrition.json` は KFC Japan 公式 PDF から手動で更新している（`data/raw/260408.pdf` が証拠）。
PDF はファイル名に `YYMMDD` 形式の日付を含む。
ユーザーは `https://www.kfc.co.jp/food_information` ページ内のリンクから手動でダウンロードしていた。
更新を見逃さないよう、毎週金曜の早朝に自動でサイトを確認し、新しい PDF が公開されていれば email で通知する GitHub Actions ワークフローを追加する。

---

## 調査結果と注意点

| 項目 | 内容 |
|------|------|
| ローカル日付 | `data/nutrition.json` の `.date` フィールド: `"2026/4/8"` |
| ローカル PDF ファイル名 | `data/raw/260408.pdf` → YYMMDD = `260408` |
| PDF URL の所在 | `https://www.kfc.co.jp/food_information` ページ内のリンク |
| **⚠️ ページ応答** | WebFetch で 2 回タイムアウト。JS レンダリングまたは bot 保護の可能性あり |
| 対策 | `curl` にブラウザ風 User-Agent を付与して試みる（`workflow_dispatch` でテスト可能）|
| JS レンダリングの場合 | Step を Playwright に差し替え（プラン内に代替手順を記載）|

---

## 実装ファイル

### `.github/workflows/check-nutrition-update.yml` (新規)

唯一の機能ファイル。既存の `ci-cd.yml` / `deploy-preview.yml` には手を加えない。

---

## ワークフロー設計

### トリガー

```yaml
on:
  schedule:
    - cron: '0 18 * * 4'  # 金曜 03:00 JST（UTC 木曜 18:00）
  workflow_dispatch:        # 手動テスト用
```

### ジョブ `check-update` のステップ

#### Step 1: Checkout

```yaml
- uses: actions/checkout@v6
```

#### Step 2: KFC JP ページから PDF URL を取得

```bash
curl -s -L --max-time 30 \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36" \
  -H "Accept-Language: ja-JP,ja;q=0.9" \
  "https://www.kfc.co.jp/food_information" -o page.html

PDF_URL=$(grep -oP 'https://[^"]*\d{6}[^"]*\.pdf' page.html | head -1)
if [ -z "$PDF_URL" ]; then
  echo "::error::PDF URL not found"
  exit 1
fi
SITE_DATE=$(echo "$PDF_URL" | grep -oP '\d{6}' | head -1)
echo "site_date=$SITE_DATE" >> "$GITHUB_OUTPUT"
echo "pdf_url=$PDF_URL" >> "$GITHUB_OUTPUT"
```

> **JS レンダリングの場合の代替**: curl の代わりに Node.js + Playwright step で同等の取得を行う。

#### Step 3: ローカル日付を YYMMDD 形式に変換

```bash
DATA_DATE=$(jq -r '.date' data/nutrition.json)  # "2026/4/8"
YY=$(echo "$DATA_DATE" | awk -F'/' '{printf "%s", substr($1,3,2)}')
MM=$(echo "$DATA_DATE" | awk -F'/' '{printf "%02d", $2}')
DD=$(echo "$DATA_DATE" | awk -F'/' '{printf "%02d", $3}')
echo "local_date=${YY}${MM}${DD}" >> "$GITHUB_OUTPUT"  # "260408"
```

#### Step 4: 日付比較 → メール送信（サイト日付 > ローカル日付の場合のみ）

```yaml
- name: Send notification
  if: steps.fetch.outputs.site_date > steps.date.outputs.local_date
  uses: dawidd6/action-send-mail@v17
  with:
    server_address: smtp.gmail.com
    server_port: 587
    secure: false
    username: ${{ secrets.MAIL_USERNAME }}
    password: ${{ secrets.MAIL_PASSWORD }}
    subject: "[KFC JP] 栄養成分 PDF が更新されています"
    to: ${{ secrets.MAIL_TO }}
    from: KFC JP PFC Checker <${{ secrets.MAIL_USERNAME }}>
    body: |
      KFC Japan の栄養成分 PDF が更新されています。

      現在のデータ日付: ${{ steps.date.outputs.local_date }}
      サイトの PDF 日付: ${{ steps.fetch.outputs.site_date }}
      PDF URL: ${{ steps.fetch.outputs.pdf_url }}

      data/nutrition.json を更新してください。
```

---

## 使用 Action バージョン

| Action | 使用バージョン | 備考 |
|--------|------------|------|
| `actions/checkout` | **v6** | 本プロジェクトで既に使用中（最新） |
| `dawidd6/action-send-mail` | **v17** | 2024-04-28 リリース、最新 |

`actions/setup-node` はこのワークフローでは不要（Node.js を使わないため）。

---

## 必要な GitHub Secrets

| Secret 名 | 内容 |
|-----------|------|
| `MAIL_USERNAME` | 送信元 Gmail アドレス |
| `MAIL_PASSWORD` | Gmail アプリパスワード（16文字）|
| `MAIL_TO` | 通知先メールアドレス |

---

## 検証手順

1. `workflow_dispatch` で手動トリガー → Actions タブでログ確認
2. curl が PDF URL を正しく抽出しているか確認
3. `data/nutrition.json` の `.date` を意図的に古い値（例: `"2020/1/1"`）に変更して再実行 → メールが届くか確認
4. 元の日付に戻す
5. curl タイムアウトや空 URL の場合は Playwright 代替に切り替える
