import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './../pages/HomePage';
import Dasboard from './../pages/DasboardPage';
import About from './../pages/About';
import SignInPage from './../pages/SignInPage';
import SignUpPage from './../pages/SignUpPage';
import ProjectPage from './../pages/ProjectPage';
import HeaderComponent from '../components/HeaderComponent/HeaderComponent';

export default function App() {
    return (
        <BrowserRouter>
            <HeaderComponent />
            <Routes>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/dashboard" element={<Dasboard />}></Route>
                <Route path="/about" element={<About />}></Route>
                <Route path="/sign-in" element={<SignInPage />}></Route>
                <Route path="/sign-up" element={<SignUpPage />}></Route>
                <Route path="/project-page" element={<ProjectPage />}></Route>
            </Routes>
        </BrowserRouter>
    );
}
