import { Response } from 'express'
import { AuthRequest } from '../middleware/verify-token'
import { favsService } from '../services/favs.service'
import { AddFavBody, DeleteFavParams } from '../types/models'

export const getFavs = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user
    if (!user) return res.status(401).json({ message: 'Unauthorized' })

    const favs = await favsService.getFavs(user.uid)
    return res.json(favs)
  } catch (err) {
    console.error('[getFavs]', err)
    return res.status(500).json({ message: 'Failed to get favs' })
  }
}

export const addFav = async (
  req: AuthRequest<{}, any, AddFavBody>,
  res: Response
) => {
  try {
    const user = req.user
    if (!user) return res.status(401).json({ message: 'Unauthorized' })

    const { productId } = req.body
    const favs = await favsService.addFav(user.uid, productId)
    return res.json(favs)
  } catch (err) {
    console.error('[addFav]', err)
    return res.status(500).json({ message: 'Failed to add fav' })
  }
}

export const removeFav = async (
  req: AuthRequest<DeleteFavParams>,
  res: Response
) => {
  try {
    const user = req.user
    if (!user) return res.status(401).json({ message: 'Unauthorized' })

    const { productId } = req.params
    const favs = await favsService.removeFav(user.uid, productId)
    return res.json(favs)
  } catch (err) {
    console.error('[removeFav]', err)
    return res.status(500).json({ message: 'Failed to remove fav' })
  }
}

export const getFavProducts = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
      
    let ids: string[] 
    const {productIds} = req.query

    if(productIds) {
      ids = (productIds as string).split(',')
    } else {
      const favs = await favsService.getFavs(user.uid)
      ids = favs.productIds
    }

    if (ids.length === 0) {
      return res.json([])
    }

    const products = await favsService.getFavProducts(ids)
    return res.json(products)
  } catch (err) {
    console.error('[getFavProducts]', err)
    return res.status(500).json({ message: 'Failed to get fav products' })
  }
}