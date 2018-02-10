export const setUser = (firstname, lastname, email, user_id) => {
  return {
    type: 'SET_USER',
    firstname: firstname,
    lastname: lastname,
    email: email,
    user_id: user_id,
  }
}
