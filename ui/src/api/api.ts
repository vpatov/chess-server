import axios from "axios";
import { FenString } from "../models/fen";

const server_url = "http://localhost:8080";

export async function get_legal_moves(fenString: FenString) {
  const data = { fen: fenString };
  const response = await axios.post(`${server_url}/legal_moves`, data);
  return response;
}

export async function get_status() {
  const response = await axios.get(`${server_url}`);
  console.log(response);
}
