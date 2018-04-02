export function homeReducer(state = {
  home_display_names: [],
  home_profile_pictures: [],
  home_post_times: [],
  home_posts: [],
}, action) {

  switch (action.type) {
    case 'REPLACE_HOME_POSTS': {
      return {
        ...state, home_posts: action.posts,
                  home_post_times: action.post_times,
                  home_profile_pictures: action.profile_pictures,
                  home_display_names: action.display_names,
         }
       }
    default: {
      return state;
    }
  }
}
