export const replacePosts = (posts, post_times) => {
  return {
    type: 'REPLACE_POSTS',
    posts: posts,
    post_times: post_times,
  }
}
