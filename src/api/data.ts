import axios from 'axios';

export interface UpdateParams {
  id: number;
  field: string;
  value: any;
  updateOperateToken: string;
}

export function update(params: UpdateParams) {
  return axios.post('/api/data/update', params);
}
