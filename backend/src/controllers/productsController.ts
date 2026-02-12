import { Request, Response } from "express";
import { getFilteredProducts } from "../services/products.service";
import { db } from "../config/firebaseAdmin";
import { getBadgesMap } from "../utils/get-badges-map";
import { getStockMap } from "../utils/get-stock-map";
import { Badge } from "../types/models";

async function getProducts(req: Request, res: Response) {
	try {
		const products = await getFilteredProducts(req.query, req.lang)
		res.json(products)
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: 'Failed to fetch products' });
	}
}

async function getProductBySlug(req: Request, res: Response) {
	try {
		const { slug } = req.params

		if (!slug || typeof slug !== 'string') {
			return res.status(400).json({
				message: 'Invalid slug parameter'
			})
		}

		const snapshot = await db
			.collection('products')
			.where('slug', '==', slug)
			.limit(1)
			.get()

		if (snapshot.empty) {
			res.status(404).json({
				message: 'Product not found'
			})
		}

		const productDoc = snapshot.docs[0]
		const badgesMap = await getBadgesMap();
		const stockMap = await getStockMap();

		const product = {
			id: productDoc.id,
			...productDoc.data(),
			badges: (productDoc.data().badges as string[])
				.map((badgeName) => badgesMap.get(badgeName))
				.filter((badge): badge is Badge => badge !== undefined)
				.sort((a, b) => a!.priority - b!.priority),
			stock: stockMap.get(productDoc.data().stock),
		}

		res.json(product)
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: 'Failed to fetch products' });
	}
}

export {
	getProducts,
	getProductBySlug
}