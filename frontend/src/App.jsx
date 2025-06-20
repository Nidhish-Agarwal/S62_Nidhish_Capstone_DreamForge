import "./App.css";
import SignupForm from "./auth/SignUpForm";
import LoginForm from "./auth/LoginForm";
import Unauthorized from "./Pages/Unauthorized";
import NotFound from "./Pages/NotFound";
import Dashboard from "./Pages/Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./Pages/LandingPage2";
import ProfilePage from "./Pages/ProfilePage";
import MyDreamsPage from "./Pages/MyDreamsPage";
import { Toaster } from "sonner";
import CommunityPage from "./Pages/CommunityPage";
import AllPostsPage from "./Pages/AllPostsPage";
import MyPostsPage from "./Pages/MyPostsPage";
import BookmarksPage from "./Pages/BookmarksPage";
import HelpPage from "./Pages/HelpPage";
import { SentryErrorBoundary } from "./Pages/ErrorBoundary";

function App() {
  return (
    <>
      <SentryErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Toaster position="bottom-right" richColors />
                <LandingPage />
              </>
            }
          />

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
                    <Toaster position="bottom-right" richColors />
                    <Dashboard />
                  </MainLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <MainLayout>
                    <Toaster position="bottom-right" richColors />
                    <ProfilePage />
                  </MainLayout>
                }
              />
              <Route
                path="/mydreams"
                element={
                  <MainLayout>
                    <Toaster position="bottom-right" richColors />
                    <MyDreamsPage />
                  </MainLayout>
                }
              />

              <Route
                path="/community"
                element={
                  <MainLayout>
                    <Toaster position="bottom-right" richColors />
                    <CommunityPage />
                  </MainLayout>
                }
              >
                <Route index element={<Navigate to="all-posts" replace />} />
                <Route path="all-posts" element={<AllPostsPage />} />
                <Route path="my-posts" element={<MyPostsPage />} />
                <Route path="bookmarks" element={<BookmarksPage />} />
              </Route>
            </Route>

            <Route
              path="/help"
              element={
                <MainLayout>
                  <Toaster position="bottom-right" richColors />
                  <HelpPage />
                  {/* here it i1Q2`1 `   */}
                </MainLayout>
              }
            />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SentryErrorBoundary>
    </>
  );
}

export default App;
