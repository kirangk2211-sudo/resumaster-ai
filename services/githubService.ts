
import { ResumeData } from "../types";

const GIST_DESCRIPTION = "ResuMaster AI - Secure Resume Backup";
const GIST_FILENAME = "resumaster-data.json";

export const githubService = {
  /**
   * Saves the resume data to a private GitHub Gist
   */
  async syncToGithub(token: string, data: ResumeData): Promise<string | null> {
    try {
      // 1. Find existing ResuMaster Gist
      const gistsResponse = await fetch("https://api.github.com/gists", {
        headers: { Authorization: `token ${token}` }
      });
      
      if (!gistsResponse.ok) throw new Error("Auth failed");
      
      const gists = await gistsResponse.json();
      const existingGist = gists.find((g: any) => g.description === GIST_DESCRIPTION);

      const payload = {
        description: GIST_DESCRIPTION,
        public: false,
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify(data, null, 2)
          }
        }
      };

      let response;
      if (existingGist) {
        // Update existing
        response = await fetch(`https://api.github.com/gists/${existingGist.id}`, {
          method: "PATCH",
          headers: { 
            Authorization: `token ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new
        response = await fetch("https://api.github.com/gists", {
          method: "POST",
          headers: { 
            Authorization: `token ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) return null;
      const result = await response.json();
      return result.updated_at;
    } catch (error) {
      console.error("GitHub Sync Error:", error);
      return null;
    }
  },

  /**
   * Fetches data from GitHub Gist if it exists
   */
  async fetchFromGithub(token: string): Promise<ResumeData | null> {
    try {
      const response = await fetch("https://api.github.com/gists", {
        headers: { Authorization: `token ${token}` }
      });
      
      if (!response.ok) return null;
      
      const gists = await response.json();
      const gist = gists.find((g: any) => g.description === GIST_DESCRIPTION);
      
      if (!gist) return null;

      const fileResponse = await fetch(gist.files[GIST_FILENAME].raw_url);
      return await fileResponse.json();
    } catch (error) {
      return null;
    }
  }
};
