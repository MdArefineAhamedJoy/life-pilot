import type { LifeNote } from "@/lib/types";
import { apiClient } from "@/services/api-client";

export type NotePayload = Pick<LifeNote, "title" | "body"> & { tags?: string[] };
export const notesService = {
  async list() { return (await apiClient.get<LifeNote[]>("/life-os/notes")).data; },
  async create(payload: NotePayload) { return (await apiClient.post<LifeNote>("/life-os/notes", payload)).data; },
  async update(noteId: string, payload: NotePayload) { return (await apiClient.put<LifeNote>(`/life-os/notes/${noteId}`, payload)).data; },
  async remove(noteId: string) { await apiClient.delete(`/life-os/notes/${noteId}`); },
};
