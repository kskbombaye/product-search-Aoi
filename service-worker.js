// キャッシュ名（バージョン管理用）
const CACHE_NAME = "jan-search-v1";

// キャッシュするファイル一覧
const urlsToCache = [
  "index.html",
  "manifest.json",
  "master.csv",
  "icon-192.png",
  "icon-512.png"
];

// インストール時：ファイルをキャッシュ
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// リクエスト時：キャッシュ優先で取得
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュがあればそれを返す
      if (response) {
        return response;
      }
      // なければネットワークから取得
      return fetch(event.request);
    })
  );
});

// 更新時：古いキャッシュを削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});
