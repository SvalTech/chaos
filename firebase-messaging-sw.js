importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// Must be exactly the same config as your script.js
const firebaseConfig = { 
    apiKey: "AIzaSyAD2NBd8w86uMkuF5Kt6VG4qjb0LPDClj0", 
    authDomain: "auth.sval.tech", 
    projectId: "studydashboard-2a3eb", 
    storageBucket: "studydashboard-2a3eb.firebasestorage.app", 
    messagingSenderId: "79210973277", 
    appId: "1:79210973277:web:cc0a5fa86729fd6d3f65b4" 
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// This fires when the push arrives and the app is completely closed
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo.png', // Make sure you have a logo.png in your root folder
        badge: '/logo.png',
        vibrate: [200, 100, 200]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});