export const replacePosts = (posts) => {
  return {
    type: 'REPLACE_POSTS',
    posts: posts,
  }
}
