import admin  from 'firebase-admin'
import fs from 'fs'
import path from 'path'

import serviceAccountJSON from '../../backend/src/freshok-market-firebase-adminsdk-fbsvc-a25e9ae2ac.json'

const serviceAcocunt = serviceAccountJSON as admin.ServiceAccount

admin.initializeApp({
  credential: admin.credential.cert(serviceAcocunt) // БУДЕТ РАБОТАТЬ С ПРОЕКТОМ, КОТОРЫЙ УКАЗАН В СЕРВИСНОМ АККАУНТЕ
  // credential: admin.credential.applicationDefault() // ОБРАТИТСЯ К БД HOPR CMS
})

const db = admin.firestore()

const roles = {
  superAdmin: {
    name: "Super Admin",
    description: "Full access to everything",
    permissions: [
      'user.create', 'user.read', 'user.update', 'user.delete',
      'user.role.change', 'user.list',
      'product.create', 'product.read', 'product.update', 'product.delete',
      'order.create', 'order.read', 'order.update', 'order.delete',
      'report.view', 'audit.read'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  admin: {
    name: 'Admin',
    description: 'Full CRUD, cannot change roles',
    permissions: [
      // all product/order permissions + user.* except role.change
      'user.read', 'user.create', 'user.update', 'user.delete', 'user.list',
      'product.create', 'product.read', 'product.update', 'product.delete',
      'order.create', 'order.read', 'order.update', 'order.delete',
      'report.view'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  manager: {
    name: 'Manager',
    description: 'Manage products and orders, limited delete',
    permissions: [
      'product.create', 'product.read', 'product.update',
      'order.read', 'order.update',
      'report.view'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  customer: {
    name: 'Customer',
    description: 'Regular user',
    permissions: [
      'product.read', 'order.create', 'order.read:own'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }
}

const permissions = [
  { id: 'user.create', name: 'Create user', category: 'user' },
  { id: 'user.read', name: 'Read user', category: 'user' },
  { id: 'user.update', name: 'Update user', category: 'user' },
  { id: 'user.delete', name: 'Delete user', category: 'user' },
  { id: 'user.list', name: 'List users', category: 'user' },
  { id: 'user.role.change', name: 'Change user role', category: 'user' },

  { id: 'product.create', name: 'Create product', category: 'product' },
  { id: 'product.read', name: 'Read product', category: 'product' },
  { id: 'product.update', name: 'Update product', category: 'product' },
  { id: 'product.delete', name: 'Delete product', category: 'product' },

  { id: 'order.create', name: 'Create order', category: 'order' },
  { id: 'order.read', name: 'Read order', category: 'order' },
  { id: 'order.update', name: 'Update order', category: 'order' },
  { id: 'order.delete', name: 'Delete order', category: 'order' },

  { id: 'report.view', name: 'View reports', category: 'report' },
  { id: 'audit.read', name: 'Read audit logs', category: 'audit' }
];

async function seed() {
  try {
    for (const [roleId, data] of Object.entries(roles)) {
      const docRef = db.collection('roles').doc(roleId)
      const doc = await docRef.get()

      if(!doc.exists) {
        await docRef.set(data)
        console.log(`created role ${roleId}`)
      } else {
        console.log(`Role exists, skipping: ${roleId}`)
      }
    }

    console.log('Seed finished.')
    process.exit(0)
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed()

