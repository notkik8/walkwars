import apiClient from './client';

export interface Step {
  id: number;
  user_id: number;
  group_id: number;
  step_count: number;
  submitted_at: string;
}

export interface StepCreate {
  step_count: number;
}

export interface LeaderboardEntry {
  username: string;
  total_steps: number;
}

export const stepsAPI = {
  submitSteps: async (groupId: number, data: StepCreate): Promise<Step> => {
    const response = await apiClient.post(`/steps/${groupId}`, data);
    return response.data;
  },

  getLeaderboard: async (groupId: number): Promise<LeaderboardEntry[]> => {
    const response = await apiClient.get(`/steps/leaderboard/${groupId}`);
    return response.data;
  },
};



