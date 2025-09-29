import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      console.log('Notification permission granted.')
      return await getFCMToken()
    } else {
      console.log('Unable to get permission to notify.')
      return null
    }
  } catch (error) {
    console.error('An error occurred while requesting permission:', error)
    return null
  }
}

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    })
    if (currentToken) {
      return currentToken
    } else {
      console.log(
        'No registration token available. Request permission to generate one.',
      )
      return null
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err)
    return null
  }
}

export const onForegroundMessage = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })
}
