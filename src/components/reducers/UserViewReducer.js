export function userViewReducer(state = {
  user_view_profile_picture:'',
  user_view_display_name: '',
  user_view_id: '',
  user_view_post_times: [],
  user_view_posts: [],
  user_view_posts_likes_dislikes: [],
}, action) {

  switch (action.type) {

    case 'SET_USER_VIEW': {
      return {
        ...state, user_view_display_name: action.display_name,
                  user_view_id: action.user_id,
                  user_view_posts: [],
                  user_view_post_times: [],
         }
      }

    case 'REPLACE_USER_VIEW_POSTS': {
      return {
        ...state, user_view_posts: action.posts,
                  user_view_post_times: action.post_times,
         }
       }

    case 'ADD_USER_VIEW_PROFILE_PICTURE': {
      return {
        ...state, user_view_profile_picture: action.profile_picture,
         }
      }

    case 'REPLACE_USER_VIEW_POSTS_LIKES_DISLIKES': {
      return {
        ...state, user_view_posts_likes_dislikes: action.posts_likes_dislikes,
      }
    }

    default: {
      return state;
    }
  }
}
