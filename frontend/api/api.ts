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

export interface UrlInfo {
  originalUrl: string;
  createdAt: string;
  clickCount: number;
}

export interface UrlAnalytics {
  clickCount: number;
  recentIps: string[];
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

  return response.json();
};

export const getUrlInfo = async (shortCode: string): Promise<UrlInfo> => {
  const response = await fetch(`${API_URL}/info/${shortCode}`);
  return response.json();
};

export const getUrlAnalytics = async (
  shortCode: string
): Promise<UrlAnalytics> => {
  const response = await fetch(`${API_URL}/analytics/${shortCode}`);
  return response.json();
};

export const deleteUrl = async (shortCode: string): Promise<void> => {
  await fetch(`${API_URL}/delete/${shortCode}`, {
    method: "DELETE",
  });
};
