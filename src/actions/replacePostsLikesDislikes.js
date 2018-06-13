export const replacePostsLikesDislikes = (posts_likes, posts_dislikes) => {
  return {
    type: 'REPLACE_POSTS_LIKES_DISLIKES',
    posts_likes: posts_likes,
    posts_dislikes: posts_dislikes,
  }
}
