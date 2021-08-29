import { auth } from "../store/Firebase"
import { store } from "../store/store"
import { setUsername } from "../store/UserReducers"

auth.onAuthStateChanged((usr) => {
  if(!usr) return
  store.dispatch(setUsername({
    username: usr.displayName ?? "",
    uid: usr.uid
  })) 
})