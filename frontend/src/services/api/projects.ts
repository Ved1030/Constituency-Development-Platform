import { apiGet } from "./client";

export interface ProjectItem {
  id: string;
  title: string;
  department: string | null;
  status: string;
  budget: number;
  village: string | null;
  progress: number;
  created_at: string | null;
}

export interface ProjectListResponse {
  projects: ProjectItem[];
  total: number;
}

export function fetchProjects(): Promise<ProjectListResponse> {
  return apiGet<ProjectListResponse>("/projects/");
}

export function fetchProject(id: string): Promise<ProjectItem> {
  return apiGet<ProjectItem>(`/projects/${id}`);
}
