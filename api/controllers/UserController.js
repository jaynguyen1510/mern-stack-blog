import UserService from "../service/UserService.js";

const createUser = async (req, res) => {
  try {
    const response = await UserService.createUserService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};
export default { createUser };
