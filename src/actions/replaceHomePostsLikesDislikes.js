export const replaceHomePostsLikesDislikes = (posts_likes_dislikes) => {
  return {
    type: 'REPLACE_HOME_POSTS_LIKES_DISLIKES',
    posts_likes_dislikes: posts_likes_dislikes,
  }
}
