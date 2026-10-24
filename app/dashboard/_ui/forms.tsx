"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Check, Loader2, AlertCircle, ImagePlus, X } from "lucide-react";
import type { Result } from "../actions";

type Action = (prev: Result, fd: FormData) => Promise<Result>;

/** A form posting to a server action, with a short "Enregistré" / error toast. */
export function ActionForm({
  action,
  children,
  className,
  confirm,
  resetOnSuccess,
  onDone,
}: {
  action: Action;
  children: ReactNode;
  className?: string;
  confirm?: string;
  resetOnSuccess?: boolean;
  onDone?: () => void;
}) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  const [shown, setShown] = useState<Result>(null);

  useEffect(() => {
    if (!state) return;
    setShown(state);
    if (state.ok) {
      if (resetOnSuccess) ref.current?.reset();
      onDone?.();
    }
    const t = setTimeout(() => setShown(null), state.ok ? 2500 : 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form
      ref={ref}
      action={formAction}
      className={className}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {children}
      {shown && (
        <div
          role="status"
          className={`fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2.5 text-sm shadow-lg ${
            shown.ok ? "bg-foreground text-background" : "bg-destructive text-white"
          }`}
        >
          {shown.ok ? <Check className="size-4" /> : <AlertCircle className="size-4" />}
          {shown.message}
        </div>
      )}
    </form>
  );
}

export function Submit({ children, variant = "dark", className = "" }: { children: ReactNode; variant?: "dark" | "line" | "ghost" | "danger" | "ok"; className?: string }) {
  const { pending } = useFormStatus();
  const look = {
    dark: "bg-foreground text-background hover:bg-foreground/85",
    line: "border border-border bg-card hover:border-foreground",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
    danger: "text-destructive hover:bg-destructive/10",
    ok: "bg-ok text-white hover:bg-ok/90",
  }[variant];
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition disabled:opacity-60 ${look} ${className}`}
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

/** Resize + JPEG in the browser so uploads stay small (phones send 5–10 MB photos). */
export async function compress(file: File, max = 1600, quality = 0.82): Promise<string> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error("Image illisible");
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const g = canvas.getContext("2d")!;
  g.fillStyle = "#fff";
  g.fillRect(0, 0, canvas.width, canvas.height);
  g.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const png = file.type === "image/png" && max <= 600;
  return canvas.toDataURL(png ? "image/png" : "image/jpeg", quality);
}

/** One picture field: shows the current one, lets you pick a new one (sent compressed). */
export function ImageField({
  name = "imageData",
  current,
  label = "Photo",
  max = 1200,
  round = false,
  removable = false,
}: {
  name?: string;
  current?: string | null;
  label?: string;
  max?: number;
  round?: boolean;
  removable?: boolean;
}) {
  const [data, setData] = useState("");
  const [busy, setBusy] = useState(false);
  const [removed, setRemoved] = useState(false);
  const shown = data || (removed ? "" : current || "");
  return (
    <div className="flex items-center gap-4">
      <div className={`relative size-20 shrink-0 overflow-hidden bg-muted ${round ? "rounded-full" : "rounded-xl"}`}>
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="" className="size-full object-cover" />
        ) : (
          <div className="grid size-full place-items-center text-muted-foreground">
            <ImagePlus className="size-6" />
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-background/70">
            <Loader2 className="size-5 animate-spin" />
          </div>
        )}
      </div>
      <div className="space-y-1.5 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 hover:border-foreground">
          <ImagePlus className="size-4" />
          {shown ? "Changer" : label}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              try {
                setData(await compress(file, max));
                setRemoved(false);
              } catch {
                alert("Cette image ne peut pas être lue.");
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
        {removable && shown && (
          <button
            type="button"
            onClick={() => {
              setData("");
              setRemoved(true);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
          >
            <X className="size-3.5" /> Retirer la photo
          </button>
        )}
      </div>
      <input type="hidden" name={name} value={data} />
      {removable && <input type="hidden" name="removeImage" value={removed && !data ? "on" : ""} />}
    </div>
  );
}
