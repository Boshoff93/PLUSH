export const replacePostsLikesAndDislikesTotals = (likes_totals, dislikes_totals) => {
  return {
    type: 'REPLACE_POSTS_LIKES_DISLIKES_TOTALS',
    likes_totals: likes_totals,
    dislikes_totals: dislikes_totals,
  }
}
