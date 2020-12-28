import { firebaseAction, firebaseMutations } from 'vuexfire'

const state = {
  categories: [],
  bookmarks: [],
  favourites: []
}

const mutations = {
  ...firebaseMutations
}
const actions = {
  loadCategories: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, { ref }) => {
    bindFirebaseRef('categories', ref)
  }),
  loadFavourites: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, { ref }) => {
    bindFirebaseRef('favourites', ref)
  }),
  loadBookmarks: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, { ref }) => {
    bindFirebaseRef('bookmarks', ref)
  })
}

export default {
  state,
  mutations,
  actions
}
