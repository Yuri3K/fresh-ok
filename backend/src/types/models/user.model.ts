export interface DbUser {
  uid: string
  email: string
  displayName: string
  role: string
  permissions: string[]
  avatarId?: string
  avatarVersion?: number
  createdAt: number
}