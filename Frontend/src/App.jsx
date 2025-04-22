import React, {Suspense} from 'react'
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom'
import './App.css'
import MainHeader from './sharedComponents/Navigation/MainHeader'
// import UserPlaces from './places/pages/UserPlaces'
// import UpdatePlace from './places/pages/UpdatePlace'
// import Users from './users/pages/Users'
// import NewPlace from './places/pages/NewPlace'
import Auth from './users/pages/Auth'
import { AuthContext } from './sharedComponents/Context/AuthContext'
import { useAuth } from './sharedComponents/hooks/AuthHook'
import Spinner from './sharedComponents/UIElements/Spinner'

const Users = React.lazy(() => import('./users/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));

function App() {
  const { token, login, logout, userId } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        userId,
        login,
        logout,
      }}
    >
      <BrowserRouter>
        <MainHeader />
        <main className="pt-24 px-4"><Suspense fallback={
          <div><Spinner/></div>
        }>
          <Routes>
            <Route path="/" element={<Users />} />

            {token && (
              <>
                <Route path="/places/new" element={<NewPlace />} />
                <Route path="/places/:placeId" element={<UpdatePlace />} />
              </>
            )}

            <Route path="/:userId/places" element={<UserPlaces />} />

            {!token && <Route path="/auth" element={<Auth />} />}

            <Route
              path="*"
              element={<Navigate to={token ? "/" : "/auth"} replace />}
            />
          </Routes>
          </Suspense></main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}


export default App
