"use client";

import { useState } from "react";
import { createUrl } from "@/api/api";
import { UrlResponse } from "@/api/api";

export const UrlForm = () => {
  const [urlData, setUrlData] = useState<UrlResponse | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [originalUrl, setOriginalUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await createUrl({
        originalUrl,
        alias: alias || undefined,
        expiresAt: expiresAt || undefined,
      });
      setUrlData(data);
    } catch (err: any) {
      if (err.message === "Conflict") {
        setError("Такой алиас уже существует");
      } else {
        setError(err.message);
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrlData(null);
    setOriginalUrl("");
    setAlias("");
    setExpiresAt("");
    setError(null);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    if (urlData?.shortUrl) {
      navigator.clipboard.writeText(urlData.shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="w-full flex flex-col gap-12">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="url">Ваш URL *</label>
          <input
            type="url"
            placeholder="https://example.com"
            id="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            className="w-full border rounded-md p-2 bg-foreground text-lg text-background"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="alias">Пользовательский алиас</label>
          <input
            type="text"
            placeholder="my-custom-alias"
            id="alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            minLength={5}
            maxLength={20}
            className="w-full border rounded-md p-2 bg-foreground text-lg text-background"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="expiresAt">Дата истечения (опционально)</label>
          <input
            type="datetime-local"
            id="expiresAt"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full border rounded-md p-2 bg-foreground text-lg text-background"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!originalUrl || isLoading}
            className={`flex-1 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 
              focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg 
              dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:from-gray-500 disabled:via-gray-500 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none`}
          >
            {isLoading ? "Создание..." : "Создать короткую ссылку"}
          </button>

          {urlData && (
            <button
              type="button"
              onClick={handleReset}
              className="text-gray-600 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Создать новую
            </button>
          )}
        </div>
      </form>

      {urlData && (
        <div className="w-full flex flex-col gap-4 p-4 border rounded-lg bg-foreground  ">
          <h3 className="text-lg font-semibold text-background">
            Короткая ссылка создана!
          </h3>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={urlData.shortUrl}
                readOnly
                className="flex-1 border rounded-md p-2 bg-foreground text-xl font-bold text-background border-none"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center min-w-[80px]"
              >
                {isCopied ? "Скопировано!" : "Копировать"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
