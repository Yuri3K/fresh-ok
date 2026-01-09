import admin from "firebase-admin";
import fs from "fs";
import path from "path";

import serviceAccountJSON from "../json-to-base64/freshok-market-prod-3e06755f1e30.json";

const serviceAccount = serviceAccountJSON as admin.ServiceAccount;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedBadges() {
  const filePath = path.join(__dirname, "badges.json");
  const fileData = fs.readFileSync(filePath, "utf8");
  const badges = JSON.parse(fileData);

  console.log(`Found ${Object.keys(badges).length} badges...`);

  const batch = db.batch();

  for (const badge of badges) {
    const ref = db.collection("badges").doc(badge.id);

    batch.set(
      ref,
      {
        i18n: badge.i18n,
        color: badge.color,
        priority: badge.priority,
        isActive: badge.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true }
    );
  }

  await batch.commit();
  console.log("✅ Badges seeded successfully");
}

seedBadges()
  .catch(console.error)
  .finally(() => process.exit());
