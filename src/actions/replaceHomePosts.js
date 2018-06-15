export const replaceHomePosts = (posts, post_times, profile_pictures, display_names, home_post_ids) => {
  return {
    type: 'REPLACE_HOME_POSTS',
    posts: posts,
    post_times: post_times,
    profile_pictures: profile_pictures,
    display_names: display_names,
    post_ids: home_post_ids,
  }
}
