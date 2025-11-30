import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// путь к сервисному аккаунту
import serviceAccountJSON from "../json-to-base64/freshok-market-prod-3e06755f1e30.json";

const serviceAccount = serviceAccountJSON as admin.ServiceAccount;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedCategories() {
  try {
    const filePath = path.join(__dirname, "catalog.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const catalog = JSON.parse(fileData);

    console.log(`Found ${Object.keys(catalog).length} catalog...`);

    for (const [categoryId, data] of Object.entries(catalog)) {
      const docRef = db.collection("catalog").doc(categoryId);
      const doc = await docRef.get();

      if (!doc.exists) {
        await docRef.set({
          //@ts-ignore
          ...data,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Created category: ${categoryId}`);
      } else {
        await docRef.update({
          //@ts-ignore
          ...data,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Updated existing category: ${categoryId}`);
      }
    }

    console.log("catalog seeding finished successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding catalog:", err);
    process.exit(1);
  }
}

seedCategories();
