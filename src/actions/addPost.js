export const addPost = (post, post_time, post_id, types_of_posts) => {
  return {
    type: 'ADD_POST',
    post: post,
    post_time: post_time,
    post_id: post_id,
    types_of_posts: types_of_posts,
  }
}
