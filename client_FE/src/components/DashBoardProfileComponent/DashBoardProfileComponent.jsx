import { useSelector } from 'react-redux';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
const DashBoardProfileComponent = () => {
    const { currentUser } = useSelector((state) => state.user);
    console.log('user', currentUser);

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Thông tin cá nhân</h1>
            <form className="flex flex-col gap-4">
                <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                    <img
                        src={currentUser?.avatar}
                        alt="user"
                        className="rounded-full w-full h-full border-8 object-cover border-[lightgray]"
                    />
                </div>
                {/* Di chuyển InputComponent ra ngoài thẻ div của avatar */}
                <InputComponent
                    id="username"
                    placeholder="username"
                    type="text"
                    defaultValue={currentUser?.userName} // Đảm bảo truyền đúng prop defaultValue
                />
                <InputComponent
                    id="email"
                    type="text"
                    placeholder="email"
                    defaultValue={currentUser?.email} // Đảm bảo truyền đúng prop defaultValue
                />
                <InputComponent
                    id="password"
                    type="password"
                    placeholder="password"
                    // autocomplete="new-password" // Thêm thuộc tính autocomplete
                />

                <ButtonComponent type={'submit'} gradientDuoTone="purpleToBlue" outline>
                    <span>Cập nhật</span>
                </ButtonComponent>
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer">Hủy tài khoản</span>
            </div>
        </div>
    );
};

export default DashBoardProfileComponent;
