export const replacePosts = (posts, post_times, post_ids) => {
  return {
    type: 'REPLACE_POSTS',
    posts: posts,
    post_times: post_times,
    post_ids: post_ids,
  }
}
