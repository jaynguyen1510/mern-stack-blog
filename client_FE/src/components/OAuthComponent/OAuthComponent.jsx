import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../../FireBase/fireBase';
import useSignInGoogle from '../../Hooks/useSignInGoogle';

const OAuthComponent = () => {
    const auth = getAuth(app);
    const { signInWithGoogle } = useSignInGoogle(); // Sử dụng hook

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            const resultGoogle = await signInWithPopup(auth, provider);

            // Kiểm tra xem resultGoogle và resultGoogle.user có tồn tại không
            if (resultGoogle && resultGoogle?.user) {
                const formData = {
                    userName: resultGoogle?.user?.displayName,
                    email: resultGoogle?.user?.email,
                    avatar: resultGoogle?.user?.photoURL,
                };
                console.log('formData', formData);

                await signInWithGoogle(formData);
            } else {
                console.error('Không có thông tin người dùng từ Google');
            }
        } catch (error) {
            console.error('Lỗi khi đăng nhập: ', error.code, error.message);
        }
    };

    return (
        <ButtonComponent type="button" gradientDuoTone="pinkToOrange" outline onClick={handleGoogleClick}>
            <AiFillGoogleCircle className="w-6 h-6 mr-2" />
            Đăng nhập bằng Google
        </ButtonComponent>
    );
};

export default OAuthComponent;
