export const replaceUserViewPosts = (posts, post_times, post_ids) => {
  return {
    type: 'REPLACE_USER_VIEW_POSTS',
    posts: posts,
    post_times: post_times,
    post_ids: post_ids,
  }
}
