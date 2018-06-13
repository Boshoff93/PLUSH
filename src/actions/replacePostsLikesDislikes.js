export const replacePostsLikesDislikes = (posts_likes_dislikes) => {
  return {
    type: 'REPLACE_POSTS_LIKES_DISLIKES',
    posts_likes_dislikes: posts_likes_dislikes,
  }
}
