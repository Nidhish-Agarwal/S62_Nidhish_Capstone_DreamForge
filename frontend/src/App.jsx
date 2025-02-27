import "./App.css";
import SignupForm from "./auth/SignUpForm";
import LoginForm from "./auth/LoginForm";
import Unauthorized from "./Pages/Unauthorized";
import NotFound from "./Pages/NotFound";
import Dashboard from "./Pages/Dashboard";
import { Routes, Route } from "react-router-dom";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./Pages/LandingPage";
import ProfilePage from "./Pages/ProfilePage";
import MyDreamsPage from "./Pages/MyDreamsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupForm />} />
        {/* <Route path="/signup" element={<MyForm />} /> */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[2001]} />}>
            <Route
              path="/dashboard"
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              }
            />
            <Route
              path="/mydreams"
              element={
                <MainLayout>
                  <MyDreamsPage />
                </MainLayout>
              }
            />
          </Route>
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
