import { httpclient } from "../config/AxiosHelper";

export const createRoomService = async (roomDetails) => {
  const response = await httpclient.post("/api/room", roomDetails);
  return response;
};
export const joinRoomService = async (roomDetails) => {
  const response = await httpclient.get(`/api/get/${roomDetails.id}`);
  return response;
};
export const getALLMsg = async (roomId) => {
  const response = await httpclient.get(`/api/allMsg/${roomId}`);
  return response;
};
//for user registeration
export const userRegister = async (userDetails) => {
  const response = await httpclient.post("/api/auth/register", userDetails);
  return response;
};

//for user login
export const userLoginService = async (userDetails) => {
  const response = await httpclient.post("/api/auth/login", userDetails);
  return response;
};