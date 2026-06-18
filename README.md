<!--
 * @Author: ChiaEnKang
 * @Date: 2026-06-18 10:17:29
 * @LastEditors: ChiaEnKang
 * @LastEditTime: 2026-06-18 16:42:10
-->
# OpenAI Agent SDK Tutorial

A hands-on tutorial for building AI agents with the OpenAI Agent SDK.

## 作業 3：建立迷你知識庫

本作業使用 OpenAI Embeddings API 與 Qdrant Cloud 建立一個小型向量知識庫，主題選擇「開發工具介紹」。

知識庫包含 5 筆資料：

- VS Code：程式碼編輯器
- Git：版本控制工具
- Docker：容器化工具
- Postman：API 測試工具
- npm：Node.js 套件管理工具

### 檔案說明

- `data/dev-tools.js`：5 筆知識庫內容
- `lib/openai.js`：OpenAI client 設定
- `lib/qdrant.js`：Qdrant client、embedding 與搜尋函式
- `scripts/init-knowledge.js`：初始化 Qdrant collection 並寫入向量
- `scripts/search-knowledge.js`：使用 3 種不同問法測試搜尋結果

### 執行方式

先建立知識庫：

```bash
npm run init:knowledge
```

再執行搜尋測試：

```bash
npm run search:knowledge
```

### 執行畫面截圖

Qdrant Cloud 已成功建立知識庫 points：

![Qdrant Cloud 知識庫 Points 截圖](assets/qdrant_collection.JPG)

CMD 搜尋測試結果：

![知識庫搜尋測試 CMD 截圖](assets/search_smiliar_score.JPG)

### 測試結果

問題 1：

```text
我想寫程式和管理專案檔案，應該用什麼工具？
```

搜尋結果第一名：

```text
VS Code (程式碼編輯器)
分數：0.487
```

問題 2：

```text
哪個工具可以幫我記錄程式碼版本，並把作業推到 GitHub？
```

搜尋結果第一名：

```text
Git (版本控制工具)
分數：0.712
```

問題 3：

```text
我要測試後端 API 回傳資料正不正確，適合用哪個工具？
```

搜尋結果第一名：

```text
Postman (API 測試工具)
分數：0.619
```

### 結果說明

三個測試問題都能找到語意最相關的開發工具，表示 Embeddings 產生的向量可以用來做基本語意搜尋。即使問題沒有完全使用知識庫中的原句，也能依照語意找到合適結果。
