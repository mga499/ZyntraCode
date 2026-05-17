// Service Worker Firebase Cloud Messaging
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAUOR7OnrLZgTt82APHGaal4ktHPqgFdq8",
    authDomain: "zyntracode-9837f.firebaseapp.com",
    projectId: "zyntracode-9837f",
    storageBucket: "zyntracode-9837f.firebasestorage.app",
    messagingSenderId: "1098824016756",
    appId: "1:1098824016756:web:e00cb1e8cade87e71d0221"
});

const messaging = firebase.messaging();

// Recevoir les notifications en arrière-plan
messaging.onBackgroundMessage(function(payload) {
    const { title, body, icon } = payload.notification;
    self.registration.showNotification(title, {
        body: body,
        icon: icon || '/logo_zyntracode2.png',
        badge: '/logo_zyntracode2.png',
        data: payload.data
    });
});

// Clic sur la notification → ouvrir le lien
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const url = event.notification.data?.url || 'https://zyntracode.ch';
    event.waitUntil(clients.openWindow(url));
});
