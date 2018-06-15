export const replaceHomePostsLikesAndDislikesTotals = (likes_totals, dislikes_totals) => {
  return {
    type: 'REPLACE_HOME_POSTS_LIKES_AND_DISLIKES_TOTALS',
    likes_totals: likes_totals,
    dislikes_totals: dislikes_totals,
  }
}
