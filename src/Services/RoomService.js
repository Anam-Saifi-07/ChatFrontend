import { httpclient } from "../config/AxiosHelper";

export const createRoomService = async (roomDetails) => {
  const response = await httpclient.post("/api/v2/rooms", roomDetails);
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

// fetch message history of a room (ChatController2)
export const getRoomMessagesService = async (roomId, page = 0, size = 30) => {
  const response = await httpclient.get(
    `/api/v2/rooms/${roomId}/messages`,
    { params: { page, size } },
  );
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

//for fetch all new User for start person chatting
export const getAllNewUserService = async () => {
  const response = await httpclient.get("/api/v2/rooms/exploreAllNewPerson");
  return response;
};

export const getAllPersonThatInChattingService = async () => {
  const response = await httpclient.get(
    "/api/v2/rooms/getAllPersonThatInChatting",
  );
  return response;
};


//for request response service

//send personal request
export const sendPersonalRequestService = async (receiverId) => {
  await httpclient.post(
    "/api/v2/connections/personal",
    { receiverId }
  );
};

//request came from others
export const getOtherPersonalRequestService = async () => {
  const response = await httpclient.get("/api/v2/connections/personal/pending");
  return response;
  // http://localhost:8080/api/v2/connections/personal/pending
};

//personal request sent by me
export const personalRequestByMeService = async () => {
  const response = await httpclient.get("/api/v2/connections/personal/sent");
  return response;
};

//get all personal chats for listed them 
export const getAllPesonalChatsService = async () => {
  const response = await httpclient.get("/api/v2/connections/personal/allchat");
  return response;
};

//except the request
export const acceptRequestService = async (Id) => {
  const response = await httpclient.post(
    `/api/v2/connections/${Id}/accept`
  );
  return response;
};

//reject the request
export const rejectRequestService = async (Id) => {
  const response = await httpclient.post(
    `/api/v2/connections/${Id}/reject`
  );
  return response;
};

//for the groups
// 1. fetch all groups except current for listed them
export const exploreNewGroupService =async () => {
  const response = await httpclient.get("/api/v2/rooms/allGroupsExceptCurrent");
  return response;
}

// 2. send group request
export const sendGroupRequestService =async (roomId) => {
  const response = await httpclient.post(
    "/api/v2/connections/group/join",
    { roomId }
  );
  return response;
}

// my groups (groups I am member of)
export const getAllGroupsOfCurrentUserService = async () => {
  const response = await httpclient.get(
    "/api/v2/rooms/allGroupsOfCurrentUser",
  );
  return response;
};
// 3. request came from others
// getOtherPersonalRequestService;

//4. accpet from above service

//5 .reject from above service
