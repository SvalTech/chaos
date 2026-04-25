const functions = require('firebase-functions/v1'); // Explicitly import v1
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const appId = "default-app-id";
const statsRef = db.doc(`artifacts/${appId}/stats/public`);

// 1. Keep Track of Total Users
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

// 2. NEW: Send Push Notifications for Nudges
// 2. NEW: Send Push Notifications for Nudges
exports.sendNudgePushNotification = functions.firestore
    .document('artifacts/{appId}/socialProfiles/{userId}/nudges/{nudgeId}')
    .onCreate(async (snap, context) => {
        const nudgeData = snap.data();
        const receiverId = context.params.userId;
        const currentAppId = context.params.appId;

        // Fetch the receiver's social profile
        const profileRef = db.doc(`artifacts/${currentAppId}/socialProfiles/${receiverId}`);
        const profileSnap = await profileRef.get();

        if (!profileSnap.exists) {
            console.log("No profile found for user:", receiverId);
            return null;
        }

        const profileData = profileSnap.data();

        // SAFETY CHECK: Did the user disable nudges in settings?
        if (profileData.allowNudges === false) {
            console.log("Push aborted. User disabled nudges:", receiverId);
            return snap.ref.delete(); // Clean up the ignored nudge
        }

        const fcmToken = profileData.fcmToken;

        if (!fcmToken) {
            console.log("User has not enabled Push Notifications (No token).", receiverId);
            return null;
        }

        // Build the Push Payload
        const payload = {
            token: fcmToken,
            notification: {
                title: "Wake Up! 🚀",
                body: `${nudgeData.from} says it's time to focus!`
            },
            webpush: {
                fcmOptions: {
                    // Clicking the notification opens the correct Chaos app URL
                    link: "https://sval.tech/chaos"
                }
            }
        };

        // Send via Firebase Cloud Messaging
        try {
            await admin.messaging().send(payload);
            console.log(`Push sent successfully to ${receiverId}`);
        } catch (error) {
            console.error("Error sending push notification:", error);

            // If the token is invalid (user revoked permission in browser), clean it up
            if (error.code === 'messaging/invalid-registration-token' ||
                error.code === 'messaging/registration-token-not-registered') {
                await profileRef.update({ fcmToken: admin.firestore.FieldValue.delete() });
            }
        }

        // Delete the nudge doc so the database stays clean
        return snap.ref.delete();
    });