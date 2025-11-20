import { BrowserRouter, Route, Routes } from 'react-router';
import { Toaster } from 'sonner';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';

function App() {
  return (
    <>
      <Toaster richColors/>
      <BrowserRouter>
        <Routes>
          {/* {public route} */}
          <Route
            path='/signin'
            element={<SignInPage />}
          />

          <Route
            path='/signup'
            element={<SignUpPage />}
          />

          {/* {protected route} */}

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
