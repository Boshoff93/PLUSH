export const setUser = (display_name, email, user_id, access_token) => {
  return {
    type: 'SET_USER',
    display_name: display_name,
    email: email,
    user_id: user_id,
    access_token: access_token
  }
}
