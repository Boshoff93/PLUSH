export const replaceUserViewPostsLikesAndDislikesTotals = (likes_totals, dislikes_totals) => {
  return {
    type: 'REPLACE_USER_VIEW_POSTS_LIKES_AND_DISLIKES_TOTALS',
    likes_totals: likes_totals,
    dislikes_totals: dislikes_totals,
  }
}
