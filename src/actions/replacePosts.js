export const replacePosts = (posts, post_times, post_ids, types_of_posts) => {
  return {
    type: 'REPLACE_POSTS',
    posts: posts,
    post_times: post_times,
    post_ids: post_ids,
    types_of_posts: types_of_posts,
  }
}
