export function userViewReducer(state = {
  user_view_profile_picture:'',
  user_view_display_name: '',
  user_view_id: '',
  user_view_post_times: [],
  user_view_posts: [],
  user_view_post_ids: [],
  user_view_types_of_posts: [],

  user_view_posts_likes: [],
  user_view_posts_dislikes: [],
  user_view_posts_likes_totals: [],
  user_view_posts_dislikes_totals: [],

}, action) {

  switch (action.type) {

    case 'SET_USER_VIEW': {
      return {
        ...state, user_view_display_name: action.display_name,
                  user_view_id: action.user_id,
         }
      }

    case 'REPLACE_USER_VIEW_POSTS': {
      return {
        ...state, user_view_posts: action.posts,
                  user_view_post_times: action.post_times,
                  user_view_post_ids: action.post_ids,
                  user_view_types_of_posts: action.types_of_posts,
         }
       }

    case 'ADD_USER_VIEW_PROFILE_PICTURE': {
      return {
        ...state, user_view_profile_picture: action.profile_picture,
         }
      }

    case 'REPLACE_USER_VIEW_POSTS_LIKES_DISLIKES': {
      return {
        ...state, user_view_posts_likes: action.posts_likes,
                  user_view_posts_dislikes: action.posts_dislikes,
      }
    }

    case 'REPLACE_USER_VIEW_POSTS_LIKES_AND_DISLIKES_TOTALS': {
      return {
        ...state, user_view_posts_likes_totals: action.likes_totals,
                  user_view_posts_dislikes_totals: action.dislikes_totals,
      }
    }

    default: {
      return state;
    }
  }
}
