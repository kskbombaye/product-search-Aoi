// ★ キャッシュ名（バージョン管理）
const CACHE_NAME = "gcp-search-v5";  // 必ずバージョンアップすること

// キャッシュするファイル一覧（master.csv を除外）
const urlsToCache = [
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png"
];

// インストール時：必要ファイルをキャッシュ
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // 新しいSWを即時適用
});

// リクエスト時：master.csv は常に最新を取得
self.addEventListener("fetch", event => {

  // ★ master.csv はキャッシュを使わずネットワーク優先
  if (event.request.url.includes("master.csv")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // その他はキャッシュ優先
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// 新バージョン適用時：古いキャッシュを削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim(); // 新しいSWを即時反映
});
