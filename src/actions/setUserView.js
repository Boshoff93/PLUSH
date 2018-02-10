export const setUserView = (firstname, lastname, user_id) => {
  return {
    type: 'SET_USER_VIEW',
    firstname: firstname,
    lastname: lastname,
    user_id: user_id,
  }
}
