import puter from "@heyputer/puter.js";

export const signIn = async () => {
    return await puter.auth.signIn()
}

export const signOut =  () => {
    return puter.auth.signOut()
}

export const getCurrentUser = async () => {
    try{
        return await puter.auth.getUser()
    } catch (error) {
        return null
    }
}

export const isSignedIn = async () => {
    return await puter.auth.isSignedIn()
}
