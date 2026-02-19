import cloudinary from "../config/cloudinary"

export async function uploadAvatarFromUrl(imageUrl: string, userId: string) {
  try{
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'avatars',
      public_id: userId,
      overwrite: true,
      type: 'upload',
      resource_type: 'image'
    })

    return {
      avatarId: result.public_id,
      avatarVersion: result.version
    }
  } catch (err) {
    console.log('[uploadAvatarFromUrl] error' , err)
    return null
  }
}

