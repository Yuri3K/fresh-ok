import admin from "firebase-admin";
import fs from "fs";
import path from "path";

import serviceAccountJSON from "../json-to-base64/freshok-market-prod-3e06755f1e30.json";

const serviceAccount = serviceAccountJSON as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedProducts() {
  try {
    const filePath = path.join(__dirname, "products.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(raw);

    console.log(`Found ${products.length} products`);

    for (const product of products) {
      const query = await db
        .collection("products")
        .where("slug", "==", product.slug)
        .limit(1)
        .get();

      if (query.empty) {
        await db.collection("products").add({
          ...product,
          isActive: true,
          currency: "₴",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Created product: ${product.slug}`);
      } else {
        const docRef = query.docs[0].ref;

        await docRef.update({
          ...product,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Updated product: ${product.slug}`);
      }
    }

    console.log("Products seeding finished successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding products:", err);
    process.exit(1);
  }
}

seedProducts();