import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
export const FETCH_WEATHER_TODAY = 'FETCH_WEATHER_TODAY';
export const FETCH_WEATHER_WEEKLY = 'FETCH_WEATHER_WEEKLY';


const apiKey = 'cbb4cbcd3a35d7abddd827cf13751700';
const baseUrl = 'https://api.openweathermap.org/data/2.5/';

export const fetchWeatherToday = createAsyncThunk(
  'weather/fetchWeatherToday',
  async (city) => {
    const response = await axios.get(
      `${baseUrl}weather?q=${city}&units=metric&appid=${apiKey}`
    );
    return response.data;
  }
);

export const fetchWeatherWeekly = createAsyncThunk(
  'weather/fetchWeeklyWeather',
  async (city) => {
    const response = await axios.get(
      `${baseUrl}forecast?q=${city}&units=metric&appid=${apiKey}`
    );
    return response.data;
  }
);

const weatherActions = createSlice({
  name: 'weather',
  initialState: {
    currentWeather: null,
    weeklyWeather: [],
    status: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherToday.fulfilled, (state, action) => {
        state.currentWeather = action.payload;
      })
      .addCase(fetchWeatherWeekly.fulfilled, (state, action) => {
        state.weeklyWeather = action.payload.list;
      });
  },
});

export default weatherAction;