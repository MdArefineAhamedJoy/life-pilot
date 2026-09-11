import type { LifeNote } from "@/lib/types";
import { apiClient, listRequestParams, unwrapResponse } from "@/services/api-client";

export type NotePayload = Pick<LifeNote, "title" | "body"> & { tags?: string[] };
export const notesService = {
  async list() {
    return unwrapResponse(
      apiClient.get<LifeNote[]>("/life-os/notes", { params: listRequestParams })
    );
  },
  async create(payload: NotePayload) {
    return unwrapResponse(apiClient.post<LifeNote>("/life-os/notes", payload));
  },
  async update(noteId: string, payload: NotePayload) {
    return unwrapResponse(apiClient.put<LifeNote>(`/life-os/notes/${noteId}`, payload));
  },
  async remove(noteId: string) {
    await apiClient.delete(`/life-os/notes/${noteId}`);
  },
};
