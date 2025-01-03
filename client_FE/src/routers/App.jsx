import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import HeaderComponent from '../components/HeaderComponent/HeaderComponent';
import FooterComponent from '../components/FooterComponent/FooterComponent';
import PrivateDashBoard from '../components/PrivateDashBoard/PrivateDashBoard';
import CreatePostPage from '../pages/CreatePostPage';
import PrivateCreatePostAdMin from '../components/PrivateCreatePostAdMin/PrivateCreatePostAdMin';
import UpdatePost from '../pages/UpdatePost';
import PostPage from '../pages/PostPage';
import ScrollToTopComponent from '../components/ScrollToTopComponent/ScrollToTopComponent';
import SearchPage from '../pages/SearchPage';

// Sử dụng lazy loading cho các trang
const HomePage = lazy(() => import('./../pages/HomePage'));
const Dasboard = lazy(() => import('./../pages/DasboardPage'));
const About = lazy(() => import('./../pages/About'));
const SignInPage = lazy(() => import('./../pages/SignInPage'));
const SignUpPage = lazy(() => import('./../pages/SignUpPage'));
const ProjectPage = lazy(() => import('./../pages/ProjectPage'));

export default function App() {
    return (
        <>
            <BrowserRouter>
                <ScrollToTopComponent />
                <HeaderComponent />
                {/* Sử dụng Suspense để hiển thị loading khi đang tải component */}
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route element={<PrivateDashBoard />}>
                            <Route path="/dashboard" element={<Dasboard />} />
                        </Route>
                        <Route path="/about" element={<About />} />
                        <Route path="/sign-in" element={<SignInPage />} />
                        <Route path="/sign-up" element={<SignUpPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/project-page" element={<ProjectPage />} />
                        <Route path="/post/:postSlug" element={<PostPage />} />
                        <Route element={<PrivateCreatePostAdMin />}>
                            <Route path="/create-post" element={<CreatePostPage />} />
                            <Route path="/update_post/:postId" element={<UpdatePost />} />
                        </Route>
                    </Routes>
                </Suspense>
                <FooterComponent />
            </BrowserRouter>
        </>
    );
}
