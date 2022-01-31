import axios from "axios";
import { CHESS_SERVER_HOST, HTTP_SERVER_PORT } from "../models/constants";
import { FenString } from "../models/fen";

export declare interface CreateGameRequest {
  white_time_control: TimeControl;
  black_time_control: TimeControl;
  use_matchmaking_pool: boolean;
  player_requests_white: boolean;
  requestor_client_uuid: string;
}

export declare interface TimeControl {
  time_left_ms: number;
  increment_ms: number;
}


const server_url = `http://${CHESS_SERVER_HOST}:${HTTP_SERVER_PORT}`;

export async function get_legal_moves(fenString: FenString) {
  const data = { fen: fenString };
  const response = await axios.post(`${server_url}/legal_moves`, data);
  return response;
}

const api = axios.create({
  baseURL: server_url,
});

export async function get_status() {
  const response = await axios.get(`${server_url}`);
  console.log(response);
}

export const create_game = (request: CreateGameRequest, onSuccess: any, onError: any) => {
  const url = '/create_game';
  return api.post(url, request).then(onSuccess).catch(onError);
};

// export function create_game(request: CreateGameRequest) {
//   axios.post(`${server_url}/create_game`, request)
//     .then((response) => { })
//     .catch(() => { });

  // const r = async () => {
  //   try {
  //     const resp = await axios.post(`${server_url}/create_game`, request);
  //     return resp.data['gameInstanceUUID'];
  //   } catch (err) {
  //     // Handle Error Here
  //     console.error(err);
  //   }
  // };
  // return r();
// }
