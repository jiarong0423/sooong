# 黑客松實務專家徵詢頁

這是可公開放到 GitHub Pages 的問卷式版本。

## 檔案

- `index.html`
- `styles.css`
- `app.js`
- `config.js`
- `guard.js`

## Google Sheets 寫入

GitHub Pages 只能放前端，不能直接寫 Google Sheets。

安全流程：

1. 建立 Google Apps Script Web App。
2. 將後端程式部署在 Apps Script。
3. 在 Apps Script 的 Script Properties 設定：
   - `SPREADSHEET_ID`
   - `SHEET_NAME`
4. 將 Web App URL 填入 `config.js` 的 `googleScriptEndpoint`。

前端不放 Google API 金鑰，也不放 Sheet ID。

## 前端安全邊界

- `guard.js` 只做基本 F12、右鍵與常見檢視快捷鍵阻擋。
- 這不是安全機制，只是降低一般社群使用者誤開或直接複製。
- 真正安全邊界是：前端不放秘密、Google Sheets 寫入走後端、公開 repo 只放 `public_site`。

## 使用方式

把這個資料夾的內容放到 GitHub Pages 專用 repo，或放到 repo 根目錄後啟用 GitHub Pages。

不要把上層專案資料夾整包公開。
