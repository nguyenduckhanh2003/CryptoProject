import { get} from "../utils/request";



export const getListCoin = async () => {
  const data = await get("coin/list-coins");
  return data;
};

export const getCoinDetail = async (coinKey) => {
  const data = await get(`coin/get-coin/${coinKey}`);
  return data;
};

export const decodeJwt = async (token) => {
  const data = await get(`api/v1/auth/email/${token}`);
  console.log(data);
  return data;

};
