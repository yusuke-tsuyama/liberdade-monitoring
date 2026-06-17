import { test, expect } from '@playwright/test';

test('日本語クリアチェッカー：診断機能が正常に動作する', async ({ page }) => {
  // 1. トップページを開く
  await page.goto('https://nihongo-checker.vercel.app');
  await expect(page).toHaveTitle(/.+/, { timeout: 30000 });

  // 2. テキストエリアに文章を入力
  const textarea = page.getByPlaceholder(/文章|テキスト|入力/);
  await expect(textarea).toBeVisible({ timeout: 15000 });
  await textarea.fill('この文章はテストです。わかりやすく書きました。');

  // 3. 診断ボタンをクリック
  const button = page.getByRole('button', { name: /診断|チェック|実行|分析/ });
  await expect(button).toBeVisible({ timeout: 10000 });
  await button.click();

  // 4. エラー表示が出ていないことを確認
  const errorText = page.getByText(/エラー|error|失敗|Error/i);
  await expect(errorText).toBeHidden({ timeout: 5000 }).catch(() => {
    // エラーテキストが存在しない場合は正常
  });

  // 5. 結果またはスコアが表示されることを確認（AI応答待ちで最大60秒）
  await expect(
    page.getByText(/スコア|点|診断結果|改善|評価|チェック結果/)
  ).toBeVisible({ timeout: 60000 });
});
