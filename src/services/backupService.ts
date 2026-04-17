import api from "./apiServices";

export const backupService = {
  exportBackup: async (): Promise<Blob> => {
    const response = await api.get("/Backup/export", {
      responseType: "blob",
    });
    return response.data;
  },

  importBackup: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);

    await api.post("/Backup/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
