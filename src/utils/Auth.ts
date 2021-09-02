import { auth } from "../store/Firebase"
import { store } from "../store/store"
import { setUser } from "../store/UserReducers"

auth.onAuthStateChanged((usr) => {
  if(!usr) return

  

  store.dispatch(setUser({
    username: usr.displayName ?? "",
    uid: usr.uid,
  })) 
})