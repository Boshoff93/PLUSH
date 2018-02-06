export const setUserView = (name, user_id) => {
  return {
    type: 'SET_USER_VIEW',
    name: name,
    user_id: user_id
  }
}
