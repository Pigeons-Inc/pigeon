import axios from 'axios';
import { Request } from 'express';

const getRequestMethod = (req: Request) => {
  let method = axios.get;
  switch (req.method) {
    case 'POST':
      method = axios.post;
      break;
    case 'PUT':
      method = axios.put;
      break;
    case 'DELETE':
      method = axios.delete;
      break;
    case 'PATCH':
      method = axios.patch;
      break;
    case 'HEAD':
      method = axios.head;
      break;
    case 'OPTIONS':
      method = axios.options;
      break;
  }
  return method;
};

export default getRequestMethod;
