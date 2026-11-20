self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data.json(); } catch (x) { d = {title: "Mini-CRM", body: e.data ? e.data.text() : ""}; }
  e.waitUntil(self.registration.showNotification(d.title || "Mini-CRM", {
    body: d.body || "", icon: "icon-192.png", badge: "icon-192.png",
    tag: d.tag || undefined, renotify: !!d.tag, data: {url: d.url || "./"}
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type: "window", includeUncontrolled: true}).then(cs => {
    for (const c of cs) { if ("focus" in c) { c.postMessage({hash: new URL(url).hash}); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
