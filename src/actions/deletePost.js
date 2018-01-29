export const deletePost = (index) => {
  return {
    type: 'DELETE_POST',
    index: index,
  }
}
