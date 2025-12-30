import type { PathSuggestion, PlannerResponse } from '../types';

class PlannerService {
  // Mock: Submit a path suggestion to the planner
  async submitPath(path: PathSuggestion): Promise<PlannerResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock validation logic
    const isValid = path.points.length >= 3;

    if (isValid) {
      return {
        pathId: path.id,
        status: 'accepted',
        message: 'Path accepted. Executing maneuver.',
        estimatedTime: path.points.length * 2, // Mock: 2 seconds per point
      };
    } else {
      return {
        pathId: path.id,
        status: 'rejected',
        message: 'Path too short. Please provide at least 3 waypoints.',
      };
    }
  }

  // Mock: Cancel a submitted path
  async cancelPath(pathId: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: `Path ${pathId} cancelled successfully.`,
    };
  }
}

export const plannerService = new PlannerService();

