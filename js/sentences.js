export function buildSentencesFromText(text) {
  // 青空の注記っぽい行をざっくり除去（必要に応じて調整）
  const cleaned = text
    .replace(/\r/g, "")
    .replace(/《.*?》/g, "") // ルビ
    .replace(/［＃.*?］/g, "") // 注記
    .replace(/^\s+|\s+$/gm, "") // 行頭末の空白
    .replace(/\n+/g, "\n");

  // 「。」で区切って、短すぎるものを落とす
  return cleaned
    .split("。")
    .map((s) => s.trim())
    .filter((s) => s.length >= 10)
    .map((s) => s + "。");
}
