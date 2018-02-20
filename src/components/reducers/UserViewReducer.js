export function userViewReducer(state = {
  userViewProfilePicture:'',
  userViewDisplayName: '',
  userViewId: '',
  userViewPostTimes: [],
  userViewPosts: [],
}, action) {

  switch (action.type) {
    case 'SET_USER_VIEW': {
      return {
        ...state, userViewDisplayName: action.display_name,
                  userViewId: action.user_id,
                  userViewPosts: [],
                  userViewPostTimes: [],
         }
      }
    case 'REPLACE_USER_VIEW_POSTS': {
      return {
        ...state, userViewPosts: action.posts,
                  userViewPostTimes: action.post_times,
         }
       }
    case 'ADD_USER_VIEW_PROFILE_PICTURE': {
      return {
        ...state, userViewProfilePicture: action.profile_picture,
         }
      }
    default: {
      return state;
    }
  }
}
