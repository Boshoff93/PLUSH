export const replaceHomePosts = (posts, post_times, profile_pictures, display_names) => {
  return {
    type: 'REPLACE_HOME_POSTS',
    posts: posts,
    post_times: post_times,
    profile_pictures: profile_pictures,
    display_names: display_names,
  }
}
