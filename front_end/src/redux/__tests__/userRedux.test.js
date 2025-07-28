import userReducer, { loginStart, loginSuccess, loginFailure } from '../userRedux';

describe('userRedux', () => {
  const initialState = {
    currentUser: null,
    isFetching: false,
    error: false,
  };

  test('should return initial state', () => {
    expect(userReducer(undefined, {})).toEqual(initialState);
  });

  test('should handle loginStart', () => {
    const action = loginStart();
    const state = userReducer(initialState, action);
    
    expect(state.isFetching).toBe(true);
    expect(state.error).toBe(false);
  });

  test('should handle loginSuccess', () => {
    const user = { id: 1, username: 'testuser' };
    const action = loginSuccess(user);
    const state = userReducer(initialState, action);
    
    expect(state.isFetching).toBe(false);
    expect(state.currentUser).toEqual(user);
    expect(state.error).toBe(false);
  });

  test('should handle loginFailure', () => {
    const action = loginFailure();
    const state = userReducer(initialState, action);
    
    expect(state.isFetching).toBe(false);
    expect(state.error).toBe(true);
    expect(state.currentUser).toBe(null);
  });
});