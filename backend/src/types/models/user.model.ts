type Gender = 'not-set' | 'male' | 'femail'

export interface DbUser {
  uid: string
  email: string
  displayName: string
  role: string
  permissions: string[]
  avatarId?: string
  avatarVersion?: number
  birthday?: number
  gender?: Gender
  lang?: string
  phone?: string
  country?: string
  city?: string
  address?: string
  updatedAt?: number
  createdAt: number
}