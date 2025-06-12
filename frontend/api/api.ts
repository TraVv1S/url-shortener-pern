interface CreateUrlRequest {
  originalUrl: string;
  expiresAt?: string;
  alias?: string;
}

export interface UrlResponse {
  id: string;
  alias: string | null;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
  clickCount: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const createUrl = async (
  data: CreateUrlRequest
): Promise<UrlResponse> => {
  const response = await fetch(`${API_URL}/shorten`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      response.statusText || "Failed to create URL. Please try again."
    );
  }

  return response.json();
};
