import { 
  AnonymousCredential, 
  UserPasswordCredential,
  UserPasswordAuthProviderClient 
} from "mongodb-stitch-browser-sdk";
import { app } from "./app.js";

export function loginAnonymous() {
  // Allow users to log in anonymously
  const credential = new AnonymousCredential();
  return app.auth.loginWithCredential(credential);
}

export function hasLoggedInUser() {
  // Check if there is currently a logged in user
  return app.auth.isLoggedIn;
}

export function getCurrentUser() {
  // Return the user object of the currently logged in user
  return app.auth.isLoggedIn? app.auth.user : null;
}

export function logoutCurrentUser() {
  // Logout the currently logged in user
  const user = getCurrentUser();
  return app.auth.logoutUserWithId(user.id);
}

export function signupUser(email, password) {
  const emailPasswordClient = app.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
  return emailPasswordClient.registerWithEmail(email, password);
}

export function loginUser(email, password) {
  const credential = new UserPasswordCredential(email, password);
  return app.auth.loginWithCredential(credential);
}

export function sendResetPasswordEmail(email) {
  const emailPasswordClient = app.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
  return emailPasswordClient.sendResetPasswordEmail(email);
}

export function resetPassword(token, tokenId, newPassword) {
  const emailPasswordClient = app.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
  return emailPasswordClient.resetPassword(token, tokenId, newPassword);
}
