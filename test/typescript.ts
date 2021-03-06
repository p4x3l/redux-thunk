import { createStore, applyMiddleware } from 'redux';
import thunk, { ThunkAction, ThunkMiddleware } from '../index';

type State = {
  foo: string;
};

type Actions = { type: 'FOO' } | { type: 'BAR', result: number };

type ThunkResult<R> = ThunkAction<R, State, undefined, Actions>;

const initialState: State = {
  foo: 'foo'
};

function fakeReducer(state: State = initialState, action: Actions): State {
  return state;
}

const store = createStore(fakeReducer, applyMiddleware(thunk as ThunkMiddleware<State, Actions>));

store.dispatch(dispatch => {
  dispatch({ type: 'FOO' });
  // typings:expect-error
  dispatch({ type: 'BAR' })
  dispatch({ type: 'BAR', result: 5 })
  // typings:expect-error
  store.dispatch({ type: 'BAZ'});
});

function testGetState(): ThunkResult<void> {
  return (dispatch, getState) => {
    const state = getState();
    const foo: string = state.foo;
    dispatch({ type: 'FOO' });
    // typings:expect-error
    dispatch({ type: 'BAR'});
    dispatch({ type: 'BAR', result: 5 });
    // typings:expect-error
    dispatch({ type: 'BAZ'});
    // Can dispatch another thunk action
    dispatch(anotherThunkAction());
  };
}

function anotherThunkAction(): ThunkResult<string> {
  return (dispatch, getState) => {
    dispatch({ type: 'FOO' });
    return 'hello';
  }
}

store.dispatch({ type: 'FOO' });
// typings:expect-error
store.dispatch({ type: 'BAR' })
store.dispatch({ type: 'BAR', result: 5 })
// typings:expect-error
store.dispatch({ type: 'BAZ'});
store.dispatch(testGetState());

const storeThunkArg = createStore(
  fakeReducer,
  applyMiddleware(thunk.withExtraArgument('bar') as ThunkMiddleware<State, Actions, string>)
);

storeThunkArg.dispatch((dispatch, getState, extraArg) => {
  const bar: string = extraArg;
  store.dispatch({ type: 'FOO' });
  // typings:expect-error
  store.dispatch({ type: 'BAR' })
  store.dispatch({ type: 'BAR', result: 5 })
  // typings:expect-error
  store.dispatch({ type: 'BAZ'});
  console.log(extraArg);
});
