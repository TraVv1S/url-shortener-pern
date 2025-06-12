"use client";

import { useState } from "react";
import { getUrlInfo, getUrlAnalytics, deleteUrl } from "@/api/api";
import { UrlInfo, UrlAnalytics } from "@/api/api";

export const UrlManager = () => {
  const [shortCode, setShortCode] = useState("");
  const [urlInfo, setUrlInfo] = useState<UrlInfo | null>(null);
  const [analytics, setAnalytics] = useState<UrlAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "analytics">("info");

  const handleGetInfo = async () => {
    if (!shortCode) return;

    setIsLoading(true);
    setError(null);

    try {
      const info = await getUrlInfo(shortCode);
      setUrlInfo(info);
      setActiveTab("info");
    } catch (err: any) {
      setError(err.response?.data?.message || "Ссылка не найдена");
      setUrlInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAnalytics = async () => {
    if (!shortCode) return;

    setIsLoading(true);
    setError(null);

    try {
      const analyticsData = await getUrlAnalytics(shortCode);
      setAnalytics(analyticsData);
      setActiveTab("analytics");
    } catch (err: any) {
      setError(err.response?.data?.message || "Не удалось получить аналитику");
      setAnalytics(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!shortCode) return;

    if (!confirm("Вы уверены, что хотите удалить эту ссылку?")) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteUrl(shortCode);
      setUrlInfo(null);
      setAnalytics(null);
      setShortCode("");
      alert("Ссылка успешно удалена");
    } catch (err: any) {
      setError(err.response?.data?.message || "Не удалось удалить ссылку");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-4 bg-gray-50 rounded-lg">
      <details>
        <summary className="text-xl font-semibold text-gray-800">
          Управление ссылками
        </summary>
        <div className="w-full flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="shortCode"
              className="text-sm font-medium text-background"
            >
              Введите короткий код или полную ссылку:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="shortCode"
                placeholder="abc123 или http://localhost:4000/abc123"
                value={shortCode}
                onChange={(e) => {
                  const value = e.target.value;
                  // Extract short code if full URL is provided
                  const match = value.match(/\/([^\/]+)$/);
                  setShortCode(match ? match[1] : value);
                }}
                className="flex-1 border rounded-md p-2 bg-foreground text-lg text-background"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleGetInfo}
              disabled={!shortCode || isLoading}
              className="text-gray-600 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 font-medium rounded-lg text-sm px-4 py-2"
            >
              {isLoading && activeTab === "info"
                ? "Загрузка..."
                : "Получить информацию"}
            </button>

            <button
              onClick={handleGetAnalytics}
              disabled={!shortCode || isLoading}
              className="text-gray-600 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 font-medium rounded-lg text-sm px-4 py-2"
            >
              {isLoading && activeTab === "analytics"
                ? "Загрузка..."
                : "Аналитика"}
            </button>

            <button
              onClick={handleDelete}
              disabled={!shortCode || isLoading}
              className="text-gray-600 bg-gray-200 hover:bg-red-600 hover:text-white disabled:bg-gray-400 font-medium rounded-lg text-sm px-4 py-2"
            >
              {isLoading ? "Удаление..." : "Удалить"}
            </button>
          </div>

          {urlInfo && activeTab === "info" && (
            <div className="p-4 bg-foreground border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-background mb-3">
                Информация о ссылке
              </h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">
                    Оригинальная ссылка:
                  </span>
                  <p className="break-all text-gray-600 mt-1">
                    {urlInfo.originalUrl}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Создана:</span>
                  <p className="text-gray-600 mt-1">
                    {new Date(urlInfo.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Количество кликов:
                  </span>
                  <p className="text-gray-600 mt-1">{urlInfo.clickCount}</p>
                </div>
              </div>
            </div>
          )}

          {analytics && activeTab === "analytics" && (
            <div className="p-4 bg-foreground border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-background mb-3">
                Аналитика переходов
              </h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">
                    Общее количество кликов:
                  </span>
                  <p className="text-gray-600 mt-1 text-2xl font-bold">
                    {analytics.clickCount}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Последние 5 IP-адресов:
                  </span>
                  <div className="mt-1">
                    {analytics.recentIps.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-600">
                        {analytics.recentIps.map((ip, index) => (
                          <li key={index}>{ip}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">
                        Переходов пока не было
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </details>
    </div>
  );
};
