export const setUser = (name, user_id) => {
  return {
    type: 'SET_USER',
    name: name,
    user_id: user_id
  }
}
