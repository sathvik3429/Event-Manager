import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from '../lib/firebase'

// Collections
const USERS_COLLECTION = 'users'
const EVENTS_COLLECTION = 'events'
const REGISTRATIONS_COLLECTION = 'registrations'

// User Profile Services
export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, USERS_COLLECTION, userId), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() }
    } else {
      return { success: false, error: 'User profile not found' }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const updateUserProfile = async (userId, userData) => {
  try {
    await updateDoc(doc(db, USERS_COLLECTION, userId), {
      ...userData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Event Services
export const createEvent = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, eventId: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getEvent = async (eventId) => {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, eventId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } }
    } else {
      return { success: false, error: 'Event not found' }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const updateEvent = async (eventId, eventData) => {
  try {
    await updateDoc(doc(db, EVENTS_COLLECTION, eventId), {
      ...eventData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, EVENTS_COLLECTION, eventId))
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getAllEvents = async () => {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      orderBy('date', 'asc')
    )
    const querySnapshot = await getDocs(q)
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: events }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getEventsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where('category', '==', category),
      orderBy('date', 'asc')
    )
    const querySnapshot = await getDocs(q)
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: events }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getEventsByOrganizer = async (organizerId) => {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where('organizerId', '==', organizerId),
      orderBy('date', 'asc')
    )
    const querySnapshot = await getDocs(q)
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: events }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Registration Services
export const registerForEvent = async (userId, eventId) => {
  try {
    await setDoc(doc(db, REGISTRATIONS_COLLECTION, `${userId}_${eventId}`), {
      userId,
      eventId,
      registeredAt: serverTimestamp()
    })
    
    // Update event attendee count
    const eventRef = doc(db, EVENTS_COLLECTION, eventId)
    await updateDoc(eventRef, {
      currentAttendees: serverTimestamp()
    })
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const unregisterFromEvent = async (userId, eventId) => {
  try {
    await deleteDoc(doc(db, REGISTRATIONS_COLLECTION, `${userId}_${eventId}`))
    
    // Update event attendee count
    const eventRef = doc(db, EVENTS_COLLECTION, eventId)
    await updateDoc(eventRef, {
      currentAttendees: serverTimestamp()
    })
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getUserRegistrations = async (userId) => {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('userId', '==', userId)
    )
    const querySnapshot = await getDocs(q)
    const registrations = querySnapshot.docs.map(doc => doc.data())
    return { success: true, data: registrations }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getEventRegistrations = async (eventId) => {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('eventId', '==', eventId)
    )
    const querySnapshot = await getDocs(q)
    const registrations = querySnapshot.docs.map(doc => doc.data())
    return { success: true, data: registrations }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const isUserRegistered = async (userId, eventId) => {
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, `${userId}_${eventId}`)
    const docSnap = await getDoc(docRef)
    return { success: true, isRegistered: docSnap.exists() }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Real-time listeners
export const subscribeToEvents = (callback) => {
  const q = query(
    collection(db, EVENTS_COLLECTION),
    orderBy('date', 'asc')
  )
  
  return onSnapshot(q, (querySnapshot) => {
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(events)
  })
}

export const subscribeToUserEvents = (userId, callback) => {
  const q = query(
    collection(db, EVENTS_COLLECTION),
    where('organizerId', '==', userId),
    orderBy('date', 'asc')
  )
  
  return onSnapshot(q, (querySnapshot) => {
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(events)
  })
}

export const subscribeToUserRegistrations = (userId, callback) => {
  const q = query(
    collection(db, REGISTRATIONS_COLLECTION),
    where('userId', '==', userId)
  )
  
  return onSnapshot(q, (querySnapshot) => {
    const registrations = querySnapshot.docs.map(doc => doc.data())
    callback(registrations)
  })
}
