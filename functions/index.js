const functions = require('firebase-functions/v1'); // Explicitly import v1
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const appId = "default-app-id";
const statsRef = db.doc(`artifacts/${appId}/stats/public`);

exports.incrementUserCount = functions.auth.user().onCreate(async (user) => {
    return statsRef.set({
        totalUsers: admin.firestore.FieldValue.increment(1)
    }, { merge: true });
});

exports.decrementUserCount = functions.auth.user().onDelete(async (user) => {
    return statsRef.set({
        totalUsers: admin.firestore.FieldValue.increment(-1)
    }, { merge: true });
});