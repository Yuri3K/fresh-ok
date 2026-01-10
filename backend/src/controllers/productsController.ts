import { Request, Response } from "express";
import { getFilteredProducts } from "../services/products.service";

async function getProducts(req: Request, res: Response) {
	try {
		const products = await getFilteredProducts(req.query)
		res.json(products)
	} catch(err) {
		console.log(err)
		res.status(500).json({ message: 'Failed to fetch products' });
	}
}

export {
	getProducts
}