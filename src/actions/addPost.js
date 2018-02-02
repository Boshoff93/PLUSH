export const addPost = (post, post_time, post_id) => {
  return {
    type: 'ADD_POST',
    post: post,
    post_time: post_time,
    post_id: post_id,
    
  }
}
