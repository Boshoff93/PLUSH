export function userReducer(state = {
  display_name: '',
  access_token: '',
  email:'',
  user_id:'',
  post_ids: [],
  post_times: [],
  posts: [],
  posts_likes: [],
  posts_dislikes: [],
  profile_picture: '',
  following_count: '',
  followers_count: '',
  followers_or_followings: 0,
  page_title: 'PROFILE',
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
        ...state, display_name: action.display_name,
                  email: action.email,
                  user_id: action.user_id,
                  access_token: action.access_token
      }
    }
    case 'SIGN_OUT': {
      return {
        ...state, display_name: '',
                  email: '',
                  user_id: '',
                  access_token: ''
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

    case 'REPLACE_FOLLOW_COUNT': {
      return {
        ...state, following_count: action.following_count,
                  followers_count: action.followers_count,
      }
    }

    case 'FOLLOWERS_OR_FOLLOWINGS': {
      return {
        ...state, followers_or_followings: action.followers_or_followings,
      }
    }

    case 'REPLACE_DISPLAY_NAME': {
      return {
        ...state, display_name: action.display_name,
      }
    }

    case 'REPLACE_PAGE_TITLE': {
      return {
        ...state, page_title: action.page_title,
      }
    }

    case 'REPLACE_POSTS_LIKES_DISLIKES': {
      return {
        ...state, posts_likes: action.posts_likes,
                  posts_dislikes: action.posts_dislikes,
      }
    }

    default: {
      return state;
    }
  }
}
