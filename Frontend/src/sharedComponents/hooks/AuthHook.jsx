import { useEffect, useCallback, useState } from 'react'

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false)
    const [expirationDate, setExpirationDate] = useState()
    const [userId, setUserId] = useState(null);
  
    const login = useCallback((userId, token, expirationDate) => {
      setToken(token);
      setUserId(userId);
      const tokenExpiration = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
      setExpirationDate(tokenExpiration)
      localStorage.setItem('userData', JSON.stringify({userId: userId, token: token, expiration: tokenExpiration.toISOString()}))
    }, [])
  
    const logout = useCallback(() => {
      setToken(null)
      setUserId(null)
      setExpirationDate(null)
      localStorage.removeItem('userData')
    }, [])
  
    useEffect(() => {
      if (token && expirationDate) {
        const remainingTime = expirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        clearTimeout(logoutTimer);
      }
      return () => clearTimeout(logoutTimer);
    }, [token, expirationDate, logout]);
  
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      if(storedData && storedData.token && new Date(storedData.expiration) > new Date()){
        login(storedData.userId, storedData.token, new Date(storedData.expiration))
      }
    }, [login])

    return { token, login, logout, userId}
}