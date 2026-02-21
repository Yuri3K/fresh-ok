type Gender = 'male' | 'femail'

export interface DbUser {
  uid: string
  email: string
  displayName: string
  role: string
  permissions: string[]
  avatarId?: string
  avatarVersion?: number
  birthday?: string
  gender?: Gender
  lang?: string
  phone?: string
  country?: string
  city?: string
  address?: string
  description?: string
  registrationDate?: string
  updatedAt?: number
  createdAt: number
}