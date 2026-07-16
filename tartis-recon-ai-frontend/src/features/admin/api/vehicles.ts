import apiClient from "@/lib/api-client";

export const getVehicles = async () => {
    const response = await apiClient.get("/v1/vehicles");
    return response.data;
};