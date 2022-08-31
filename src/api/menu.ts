import axios from 'axios';

export interface MenuRecord {
  id: number;
  name: string;
  metaStr: string;
  parentId: number;
  status: number;
}

export interface MenuParams extends Partial<MenuRecord> {
  orderInfoMap: any;
  current: number;
  pageSize: number;
  id?: number;
  name?: string;
  parentId?: number;
  status?: number;
}

export interface MenuListRes {
  list: MenuRecord[];
  totalCount: number;
  pageSize: number;
  totalPage: number;
  pageIndex: number;
}

export function queryMenuList(params: MenuParams) {
  return axios.post<MenuListRes>('/api/menus', params);
}

export function deleteMenusByIds(ids: number[]) {
  return axios.post('/api/menus/deleteMenusByIds', { ids });
}

export function applyForUpdate() {
  return axios.get('/api/menus/applyForUpdate');
}
