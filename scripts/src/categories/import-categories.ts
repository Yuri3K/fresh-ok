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
    const filePath = path.join(__dirname, "categories.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const categories = JSON.parse(fileData);

    console.log(`Found ${Object.keys(categories).length} categories...`);

    for (const [categoryId, data] of Object.entries(categories)) {
      const docRef = db.collection("categories").doc(categoryId);
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

    console.log("Categories seeding finished successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding categories:", err);
    process.exit(1);
  }
}

seedCategories();
