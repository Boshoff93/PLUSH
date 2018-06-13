export const replaceUserViewPostsLikesDislikes = (posts_likes_dislikes) => {
  return {
    type: 'REPLACE_USER_VIEW_POSTS_LIKES_DISLIKES',
    posts_likes_dislikes: posts_likes_dislikes,
  }
}
