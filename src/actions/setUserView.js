export const setUserView = (display_name, user_id) => {
  return {
    type: 'SET_USER_VIEW',
    display_name: display_name,
    user_id: user_id,
  }
}
