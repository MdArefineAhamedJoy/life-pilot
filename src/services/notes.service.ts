import type { LifeNote } from "@/lib/types";
import { apiClient, listRequestParams, requireApiSuccess } from "@/services/api-client";

export type NotePayload = Pick<LifeNote, "title" | "body"> & { tags?: string[] };

class NotesService {
  async list() {
    return requireApiSuccess(
      await apiClient.get<LifeNote[]>("/life-os/notes", { params: listRequestParams })
    ).data;
  }

  async create(payload: NotePayload) {
    return requireApiSuccess(await apiClient.post<LifeNote>("/life-os/notes", payload)).data;
  }

  async update(noteId: string, payload: NotePayload) {
    return requireApiSuccess(await apiClient.put<LifeNote>(`/life-os/notes/${noteId}`, payload))
      .data;
  }

  async remove(noteId: string) {
    requireApiSuccess(await apiClient.delete<void>(`/life-os/notes/${noteId}`));
  }
}

export const notesService = new NotesService();
