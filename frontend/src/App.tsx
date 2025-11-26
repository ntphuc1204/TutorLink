import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import SignUpPage from "./pages/auth/SignUpPage";
import SignInPage from "./pages/auth/SignInPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./pages/auth/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* {public route} */}
          <Route path="/signin" element={<SignInPage />} />

          <Route path="/signup" element={<SignUpPage />} />

          {/* {protected route} */}
          <Route path="/" element={<ProtectedRoute />} >
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
