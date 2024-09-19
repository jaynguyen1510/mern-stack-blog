import { Footer } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsGithub } from 'react-icons/bs'; // Sửa tên biểu tượng nếu cần

const FooterComponent = () => {
    const navigate = useNavigate();
    return (
        <Footer container className="border border-t-8 border-teal-600">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5">
                        <div
                            onClick={() => navigate('/')}
                            className="cursor-pointer self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
                        >
                            <span className="px-1 pt-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                                Sức khỏe và thể hình
                            </span>
                            Blog
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <Footer.Title title="Tổng quan" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="https://www.100jsprojects.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    100 JS Projects
                                </Footer.Link>
                                <Footer.Link href="/about" target="_blank" rel="noopener noreferrer">
                                    Sức khỏe và thể hình
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Follow us" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="https://github.com/jaynguyen1510"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Github
                                </Footer.Link>
                                <Footer.Link
                                    href="https://www.facebook.com/nguyennhat.nam.161009/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    FaceBook
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Legal" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">Privacy Policy</Footer.Link>
                                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright
                        className="cursor-pointer"
                        onClick={() => {
                            navigate('/');
                        }}
                        by="Sức khỏe và thể hình"
                        year={new Date().getFullYear()}
                    />
                    <div className="flex gap-6 sm:mt-0 mt-4 justify-center">
                        <Footer.Icon
                            href="https://www.facebook.com/nguyennhat.nam.161009/"
                            icon={BsFacebook}
                            className="cursor-pointer" // thêm cursor-pointer nếu muốn
                        />{' '}
                        <Footer.Icon
                            href="https://www.instagram.com/ng.nhnam/"
                            icon={BsInstagram}
                            className="cursor-pointer" // thêm cursor-pointer nếu muốn
                        />{' '}
                        <Footer.Icon
                            href="https://github.com/jaynguyen1510"
                            icon={BsGithub}
                            className="cursor-pointer" // thêm cursor-pointer nếu muốn
                        />
                    </div>
                </div>
            </div>
        </Footer>
    );
};

export default FooterComponent;
