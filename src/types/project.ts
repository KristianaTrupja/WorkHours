export interface FormData {
  name: string;
  project: string;
}

export interface ProjectEntry {
  id: number;
  company: string;
  project: string;
}
export type Project = {
  title: string;
  projectKey: string;
};

export type ProjectData = {
  company: string;
  projects: Project[];
};

