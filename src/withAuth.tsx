import React from 'react';
import { useAppDispatch } from 'hooks';
import axios from 'axios';
import { mainUrl } from 'urls';
import { setUserData } from '@slices/profileSlice';
import { setCalendar, setOtherState } from '@slices/userPageSlice';
import { setHistory } from '@slices/userHistorySlice';
import { startTokenRefresh } from './auth';

export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>
): React.FC<T> {
  return (props: T) => {
    const [isAuthChecked, setIsAuthChecked] = React.useState(false);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
      const checkAuth = async () => {
        try {
          const jwt = localStorage.getItem('token');
          if (!jwt) {
            setIsAuthChecked(true);
            return;
          }

          const res = await axios.post(`${mainUrl}loginAndCalendar`, {}, {
            headers: {
              'Authorization': `Bearer ${jwt}`,
              'Content-Type': 'application/json'
            }
          });

          dispatch(setUserData({
            email: res.data.email,
            username: res.data.username,
            userId: res.data.id,
            password: res.data.password
          }));
          const sortedCalendar = [...res.data.calendar].sort((a: { id: number }, b: { id: number }) => a.id - b.id);
          dispatch(setCalendar(sortedCalendar));
          dispatch(setOtherState([res.data.globalTotal, res.data.weekTotal, res.data.isMonthly]));
          dispatch(setHistory(res.data.userHistory));
          
          // Start the token refresh cycle
          startTokenRefresh();
        } catch (error) {
          // If auth fails, clear tokens
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        } finally {
          setIsAuthChecked(true);
        }
      };

      checkAuth();
    }, [dispatch]);

    if (!isAuthChecked) {
      // You could return a loading spinner here
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}