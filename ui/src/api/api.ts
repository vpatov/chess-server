import axios from "axios";
import { FenString } from "../models/fen";

export async function get_legal_moves(fenString: FenString) {
  const data = { fen: fenString };
  const response = await axios.post("http://localhost:8080/legal_moves", data);
  console.log(response);
}

export async function get_status() {
  const response = await axios.get("http://localhost:8080");
  console.log(response);
}
