"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { addPhoto } from "../actions";
import { compress } from "./forms";
import { PHOTO_CATEGORIES } from "./photo-categories";
import { inputCls } from "./fields";

/** Pick several photos: each is shrunk in the browser and sent one by one. */
export function PhotoUploader() {
  const router = useRouter();
  const [category, setCategory] = useState("coupes");
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState("");

  async function send(files: File[]) {
    setError("");
    setProgress({ done: 0, total: files.length });
    let failed = 0;
    for (let i = 0; i < files.length; i++) {
      try {
        const fd = new FormData();
        fd.set("imageData", await compress(files[i]));
        fd.set("category", category);
        fd.set("caption", caption);
        const res = await addPhoto(null, fd);
        if (!res?.ok) {
          failed++;
          setError(res?.message ?? "Envoi échoué");
        }
      } catch {
        failed++;
        setError("Une photo n'a pas pu être lue.");
      }
      setProgress({ done: i + 1, total: files.length });
    }
    setProgress(null);
    if (!failed) setCaption("");
    router.refresh();
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[180px_1fr_auto] sm:items-end">
      <label className="block space-y-1.5">
        <span className="text-[13px] font-medium">Catégorie</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
          {PHOTO_CATEGORIES.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1.5">
        <span className="text-[13px] font-medium">Légende (facultatif)</span>
        <input value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={120} placeholder="Ex. : Dégradé américain" className={inputCls} />
      </label>
      <label
        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background ${progress ? "pointer-events-none opacity-70" : ""}`}
      >
        {progress ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
        {progress ? `Envoi ${progress.done}/${progress.total}…` : "Ajouter des photos"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
            e.target.value = "";
            if (files.length) void send(files.slice(0, 20));
          }}
        />
      </label>
      {error && <p className="text-sm text-destructive sm:col-span-3">{error}</p>}
    </div>
  );
}
