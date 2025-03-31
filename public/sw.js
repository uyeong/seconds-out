// This is a fallback service worker

const CACHE_NAME = 'seconds-out-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/icons/android/android-launchericon-48-48.png',
  '/icons/android/android-launchericon-72-72.png',
  '/icons/android/android-launchericon-96-96.png',
  '/icons/android/android-launchericon-144-144.png',
  '/icons/android/android-launchericon-192-192.png',
  '/icons/android/android-launchericon-512-512.png',
  '/icons/ios/16.png',
  '/icons/ios/32.png',
  '/icons/ios/57.png',
  '/icons/ios/60.png',
  '/icons/ios/72.png',
  '/icons/ios/76.png',
  '/icons/ios/114.png',
  '/icons/ios/120.png',
  '/icons/ios/144.png',
  '/icons/ios/152.png',
  '/icons/ios/180.png',
  '/icons/ios/192.png',
  '/icons/ios/512.png',
  '/bells/classic_start.wav',
  '/bells/classic_end.wav',
  '/bells/digital_start.wav',
  '/bells/digital_end.wav'
];

// 빌드된 자산 파일을 캐시하는 함수
async function cacheBuiltAssets(cache) {
  // 메인 HTML 파일 먼저 가져오기
  const response = await fetch('/');
  const html = await response.text();

  // JS와 CSS 파일 URL 찾기
  const jsFiles = html.match(/src="([^"]+\.js)"/g)?.map(src => src.replace(/src="([^"]+)"/, '$1')) || [];
  const cssFiles = html.match(/href="([^"]+\.css)"/g)?.map(href => href.replace(/href="([^"]+)"/, '$1')) || [];

  // 모든 자산 파일 캐싱
  const allAssets = [...jsFiles, ...cssFiles];
  const promises = allAssets.map(url => {
    return fetch(url).then(resp => {
      if (resp.ok) {
        return cache.put(url, resp);
      }
    }).catch(err => console.error('캐시 추가 실패:', url, err));
  });

  return Promise.all(promises);
}

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(STATIC_ASSETS)
          .then(() => cacheBuiltAssets(cache));
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or fetch from network with cache-first 전략
self.addEventListener('fetch', event => {
  // API 요청이나 POST 요청은 네트워크를 통해 직접 처리
  if (
    event.request.method !== 'GET' || 
    event.request.url.includes('/api/')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에서 찾았으면 캐시에서 제공
        if (response) {
          return response;
        }

        // 네트워크 요청
        return fetch(event.request).then(
          response => {
            // 유효한 응답이 아니면 바로 반환
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답 복제 후 캐시에 저장
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(() => {
        // 네트워크 오류 시 오프라인 페이지나 캐시된 홈페이지 제공
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('네트워크 오류 발생', { status: 408, headers: { 'Content-Type': 'text/plain' } });
      })
  );
});
