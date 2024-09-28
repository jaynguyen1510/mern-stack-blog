// service/jwtService.js
import jwt from "jsonwebtoken";

const generalAccessToken = async ({ id, isAdmin }) => {
  const access_token = jwt.sign({ id, isAdmin }, process.env.ACCESS_TOKEN);
  return access_token;
};

export default { generalAccessToken }; // Xuất đối tượng
