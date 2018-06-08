export const replaceFollowCount = (following_count, followers_count) => {
  return {
    type: 'REPLACE_FOLLOW_COUNT',
    following_count: following_count,
    followers_count: followers_count,
  }
}
