import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store/store'

export const useAppDispatch = () => useDispatch<ThunkDispatch<RootState, unknown, Action>>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
