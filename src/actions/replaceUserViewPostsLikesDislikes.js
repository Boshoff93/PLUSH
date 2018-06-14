export const replaceUserViewPostsLikesDislikes = (posts_likes, posts_dislikes) => {
  return {
    type: 'REPLACE_USER_VIEW_POSTS_LIKES_DISLIKES',
    posts_likes: posts_likes,
    posts_dislikes: posts_dislikes,
  }
}
