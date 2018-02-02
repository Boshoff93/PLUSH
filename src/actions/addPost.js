export const addPost = (post, post_time) => {
  return {
    type: 'ADD_POST',
    post: post,
    post_time: post_time,
  }
}
