import axios from "axios";
import {
  endpoint
} from "./constants";

export const authAxios = axios.create({
  baseURL: endpoint,
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`
  }
});

export const adminAxios = axios.create({
  baseURL: endpoint,
  headers: {
    Authorization: `Token ${localStorage.getItem("adminToken")}`
  }
});