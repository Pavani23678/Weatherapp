import { FETCH_WEATHER_TODAY, FETCH_WEATHER_WEEKLY } from '../weatherAction';

const initialState = {
  today: null,
  weekly: [],
};

const weatherReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WEATHER_TODAY:
      return { ...state, today: action.payload };
    case FETCH_WEATHER_WEEKLY:
      return { ...state, weekly: action.payload };
    default:
      return state;
  }
};

export default weatherReducer;