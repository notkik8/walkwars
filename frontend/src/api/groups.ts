import apiClient from './client';

export interface Group {
  id: number;
  name: string;
  group_type: string;
  created_at: string;
  is_member?: boolean;
  members?: Array<{
    id: number;
    username: string;
    email: string;
  }>;
}

export interface GroupCreate {
  name: string;
  group_type: string;
}

export const groupsAPI = {
  createGroup: async (data: GroupCreate): Promise<Group> => {
    const response = await apiClient.post('/groups/', data);
    return response.data;
  },

  getGroups: async (): Promise<Group[]> => {
    const response = await apiClient.get('/groups/');
    return response.data;
  },

  joinGroup: async (groupId: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/groups/${groupId}/join`);
    return response.data;
  },

  leaveGroup: async (groupId: number): Promise<{ message: string; deleted_steps: number }> => {
    const response = await apiClient.post(`/groups/${groupId}/leave`);
    return response.data;
  },
};



