import axios from 'axios';
import qs from 'query-string';

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
