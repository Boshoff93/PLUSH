export function homeReducer(state = {
  home_display_names: [],
  home_profile_pictures: [],
  home_post_times: [],
  home_posts: [],
  home_post_ids: [],
  home_types_of_posts: [],

  home_posts_likes: [],
  home_posts_dislikes: [],
  home_posts_likes_totals: [],
  home_posts_dislikes_totals: [],

}, action) {

  switch (action.type) {
    case 'REPLACE_HOME_POSTS': {
      return {
        ...state, home_posts: action.posts,
                  home_post_times: action.post_times,
                  home_profile_pictures: action.profile_pictures,
                  home_display_names: action.display_names,
                  home_post_ids: action.post_ids,
                  home_types_of_posts: action.home_types_of_posts,
      }
    }

    case 'REPLACE_HOME_POSTS_LIKES_DISLIKES': {
      return {
        ...state, home_posts_likes: action.posts_likes,
                  home_posts_dislikes: action.posts_dislikes,
      }
    }

    case 'REPLACE_HOME_POSTS_LIKES_AND_DISLIKES_TOTALS': {
      return {
        ...state, home_posts_likes_totals: action.likes_totals,
                  home_posts_dislikes_totals: action.dislikes_totals,
      }
    }
    default: {
      return state;
    }
  }
}
