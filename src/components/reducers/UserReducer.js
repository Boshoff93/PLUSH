export function userReducer(state = {
  firstname:'',
  lastname:'',
  email:'',
  user_id:'',
  post_ids: [],
  post_times: [],
  posts: [],
  profile_picture: '',
}, action) {

  switch (action.type) {
    case 'ADD_POST': {
      return {
          ...state,
          posts: [action.post].concat(state.posts),
          post_times: [action.post_time].concat(state.post_times),
          post_ids: [action.post_id].concat(state.post_ids),

      };
    }
    case 'DELETE_POST': {
      return {
        ...state, posts: [
                    ...state.posts.slice(0, action.index),
                    ...state.posts.slice(action.index + 1, state.posts.length),
                  ],
                  post_times: [
                    ...state.post_times.slice(0, action.index),
                    ...state.post_times.slice(action.index + 1, state.post_times.length),
                  ],
                  post_ids: [
                    ...state.post_ids.slice(0, action.index),
                    ...state.post_ids.slice(action.index + 1, state.post_ids.length),
                  ]
      };
    }
    case 'SET_USER': {
      return {
        ...state, firstname: action.firstname, lastname: action.lastname,
                  email: action.email, user_id: action.user_id,
      }
    }
    case 'REPLACE_POSTS': {
      return {
        ...state, posts: action.posts, post_times: action.post_times,
                  post_ids: action.post_ids
      }
    }
    case 'ADD_PROFILE_PICTURE': {
      return {
        ...state, profile_picture: action.profile_picture
      }
    }
    default: {
      return state;
    }
  }
}
