import { Response } from "express"
import { AuthRequest } from "../middleware/verify-token"
import { cartService } from "../services/cart.service";
import { CartItemBody, DeleteCartItemParams } from "../types/models";

const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await cartService.getCart(user.uid)
    return res.status(200).json(cart)

  } catch (err) {
    console.error("Get cart error:", err);
    return res.status(500).json({ message: "Failed to get cart" });
  }
}

// AuthRequest
//   TParams  = {}                        // req.params — пустой объект, params нам не нужны
//   TResBody = any                       // тело ответа — нас не интересует, ставим any
//   TReqBody = { items: CartItemBody[] } // req.body — вот это нам важно!
// >
const upsertCartItem = async (req: AuthRequest<{}, any, CartItemBody>, res: Response) => {
  try {
    const user = req.user

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newItem = req.body

    const cart = await cartService.upsertItem(user.uid, newItem)
    return res.json(cart)

  } catch (err) {
    console.error('Update cart item error', err)
    res.status(500).json({ message: 'Failed to update cart' })
  }
}


// AuthRequest. Указываем только TParams (DeleteCartItemParams). Остальные поля пропускаем
//   TParams  = {}                        // req.params — работаем с ним
//   TResBody = any                       // тело ответа — нас не интересует, ставим any
//   TReqBody = { items: CartItemBody[] } // req.body - any
// >
const removeCartItem = async (req: AuthRequest<DeleteCartItemParams>, res: Response) => {
  try {
    const user = req.user

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId } = req.params;
    const cart = await cartService.removeItem(user.uid, productId)
    return res.json(cart)

  } catch (err) {
    console.error('Remove cart item error', err)
    res.status(500).json({ message: 'Failed to remove cart item' })
  }
}

const saveCart = async (
  req: AuthRequest<{}, any, { items: CartItemBody[] }>,
  res: Response
) => {
  try {
    const user = req.user

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { items } = req.body
    const cart = await cartService.saveCart(user.uid, items)
    res.json(cart)

  } catch (err) {
    console.error('Save cart error', err)
    res.status(500).json({ message: 'Failed to save cart' })
  }
}

const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await cartService.clearCart(user.uid)
    res.json(cart)

  } catch (err) {
    console.error('Clear cart error', err)
    res.status(500).json({ message: 'Failed to clear cart' })
  }
}

export {
  getCart,
  upsertCartItem,
  removeCartItem,
  saveCart,
  clearCart
}