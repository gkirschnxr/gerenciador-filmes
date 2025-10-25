import { SafeResourceUrl } from "@angular/platform-browser";

export interface VideosMidiaApiResponse {
  id: number;
  results: VideoMidia [];
}

export interface VideoMidia {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string | SafeResourceUrl;
  published_at: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  id: string;
}
