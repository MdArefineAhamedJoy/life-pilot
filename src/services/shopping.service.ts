import { apiClient, requireApiSuccess, type ApiResponse } from "@/services/api-client";
import type { ShoppingFilters, ShoppingItem, ShoppingSummary } from "@/types/shopping.types";

type ShoppingListParams = ShoppingFilters & {
  page: number;
  limit: number;
};

class ShoppingService {
  async list(params: ShoppingListParams): Promise<ApiResponse<ShoppingItem[]>> {
    return requireApiSuccess(await apiClient.get<ShoppingItem[]>("/life-os/shopping", { params }));
  }

  async getSummary(filters: ShoppingFilters): Promise<ApiResponse<ShoppingSummary>> {
    return requireApiSuccess(
      await apiClient.get<ShoppingSummary>("/life-os/shopping/summary", { params: filters })
    );
  }

  async create(payload: Omit<ShoppingItem, "id">) {
    return requireApiSuccess(await apiClient.post<ShoppingItem>("/life-os/shopping", payload)).data;
  }

  async markPurchased(itemId: string) {
    return requireApiSuccess(
      await apiClient.patch<ShoppingItem>(`/life-os/shopping/${itemId}/purchased`)
    ).data;
  }

  async remove(itemId: string) {
    requireApiSuccess(await apiClient.delete<void>(`/life-os/shopping/${itemId}`));
  }
}

export const shoppingService = new ShoppingService();
