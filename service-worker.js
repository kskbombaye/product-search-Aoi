// ★ キャッシュ名（バージョン管理）
const CACHE_NAME = "gcp-search-v4";

// キャッシュするファイル一覧
const urlsToCache = [
  "index.html",
  "manifest.json",
  "master.csv",
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

// リクエスト時：キャッシュ優先
self.addEventListener("fetch", event => {
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
