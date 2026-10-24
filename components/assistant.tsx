"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, MessageCircle, RotateCcw, Sparkles, X } from "lucide-react";
import type { AssistantInfo } from "@/lib/site";

/**
 * The shop's AI customer assistant (SSS → Customer bot). The browser talks to
 * the public bot API `/api/v1/bot/:publicKey` directly: that key only reaches
 * this bot, and answers count on the shop's SSS assistant credits.
 *
 * Open it from anywhere with a link to `#assistant`, or
 *   window.dispatchEvent(new CustomEvent("bb:ask", { detail: "prefilled text" }))
 */


type ChatFile = { name: string; mediaType: string; url?: string };
type Choices = { question: string; options: string[]; multiple: boolean };
type Message = { role: "user" | "assistant"; content: string; files?: ChatFile[]; choices?: Choices; pending?: boolean };

const VISITOR_KEY = "bb_visitor_id";

const t = {
  open: "Assistant",
  close: "Fermer",
  subtitle: "Prix, disponibilités, rendez-vous",
  new_chat: "Nouvelle conversation",
  placeholder: "Votre message…",
  send: "Envoyer",
  typing: "En train d'écrire",
  error: "Le message n'est pas parti. Réessayez.",
  rate: "Trop de messages d'un coup. Patientez un instant.",
  greeting: "Bonjour 👋 Je peux vous donner nos prix, nos disponibilités et prendre votre rendez-vous.",
  suggestions: ["Je veux prendre rendez-vous", "Quels sont vos prix ?", "Êtes-vous ouverts ?"],
};

function visitorId(): string {
  try {
    const saved = localStorage.getItem(VISITOR_KEY);
    if (saved) return saved;
    const id = `v_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return `v_${Math.random().toString(36).slice(2, 14)}${Date.now().toString(36)}`;
  }
}

/* ── Tiny safe markdown (bold, italic, links, lists, paragraphs) ─────────── */

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inline(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
    if (!/^(https?:|mailto:|tel:|\/|#)/i.test(href)) return label;
    const external = /^https?:/i.test(href);
    return `<a href="${href}" class="underline underline-offset-2"${external ? ' target="_blank" rel="noopener"' : ""}>${label}</a>`;
  });
  out = out.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" class="underline underline-offset-2 break-all" target="_blank" rel="noopener">$2</a>');
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  return out;
}

function renderMarkdown(source: string): string {
  const blocks: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let para: string[] = [];
  const flushPara = () => {
    if (para.length) blocks.push(`<p>${para.map(inline).join("<br/>")}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) {
      const tag = list.ordered ? "ol" : "ul";
      blocks.push(`<${tag} class="${list.ordered ? "list-decimal" : "list-disc"} pl-5 space-y-1">${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${tag}>`);
    }
    list = null;
  };
  for (const raw of (source ?? "").split("\n")) {
    const line = raw.trimEnd();
    const bullet = /^\s*[-*•]\s+(.*)$/.exec(line);
    const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      flushPara();
      const ordered = Boolean(numbered);
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push((bullet ?? numbered)![1]);
    } else if (!line.trim()) {
      flushPara();
      flushList();
    } else if (list && /^\s{2,}/.test(raw)) {
      list.items[list.items.length - 1] += `<br/>${line.trim()}`;
    } else {
      flushList();
      para.push(line.replace(/^#{1,6}\s+/, ""));
    }
  }
  flushPara();
  flushList();
  return blocks.join("");
}

/* ── Widget ──────────────────────────────────────────────────────────────── */

export function Assistant({ apiUrl, assistant }: { apiUrl: string; assistant: AssistantInfo }) {
  const base = `${apiUrl}/api/v1/bot/${encodeURIComponent(assistant.publicKey)}/messages`;
  const greeting = assistant.greeting || t.greeting;
  const suggestions = assistant.suggestions.length ? assistant.suggestions : t.suggestions;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const visitor = useRef("");
  const historyRequested = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const loadHistory = useCallback(async () => {
    visitor.current ||= visitorId();
    try {
      const res = await fetch(`${base}?source=widget&visitorId=${encodeURIComponent(visitor.current)}`);
      const body = (await res.json()) as { data?: Message[] };
      if (res.ok && Array.isArray(body.data)) setMessages(body.data.map((m) => ({ ...m, content: m.content ?? "" })));
    } catch {
      /* the greeting still shows */
    } finally {
      setLoaded(true);
    }
  }, [base]);

  const send = useCallback(
    async (text: string) => {
      const message = text.trim();
      if (!message || busy) return;
      visitor.current ||= visitorId();
      setError(null);
      setDraft("");
      setPicked([]);
      setBusy(true);
      setMessages((prev) => [...prev.map((m) => ({ ...m, choices: undefined })), { role: "user", content: message }, { role: "assistant", content: "", pending: true }]);
      try {
        const res = await fetch(base, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message, visitorId: visitor.current, source: "widget" }),
        });
        const body = (await res.json().catch(() => null)) as {
          data?: { reply: string; files?: ChatFile[]; choices?: Choices };
          error?: { code?: string; message?: string };
        } | null;
        if (!res.ok || !body?.data) throw new Error(body?.error?.code === "RATE_LIMITED" ? t.rate : t.error);
        const reply = body.data;
        setMessages((prev) => [...prev.filter((m) => !m.pending), { role: "assistant", content: reply.reply, files: reply.files, choices: reply.choices }]);
      } catch (err) {
        setMessages((prev) => prev.filter((m) => !m.pending));
        setError(err instanceof Error && err.message ? err.message : t.error);
        setDraft(message);
      } finally {
        setBusy(false);
      }
    },
    [base, busy]
  );

  const openPanel = useCallback(() => {
    setOpen(true);
    if (!historyRequested.current) {
      historyRequested.current = true;
      void loadHistory();
    }
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }, [loadHistory]);

  const reset = useCallback(async () => {
    visitor.current ||= visitorId();
    setMessages([]);
    setError(null);
    await fetch(`${base}?source=widget&visitorId=${encodeURIComponent(visitor.current)}`, { method: "DELETE" }).catch(() => undefined);
  }, [base]);

  // Open on #assistant links and on "bb:ask" events (service cards, contact page).
  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash === "#assistant") {
        openPanel();
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };
    const onAsk = (event: Event) => {
      openPanel();
      const text = (event as CustomEvent<string>).detail;
      if (typeof text === "string" && text.trim()) setDraft(text);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("bb:ask", onAsk);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("bb:ask", onAsk);
    };
  }, [openPanel]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const last = messages[messages.length - 1];
  const choices = !busy && last?.role === "assistant" ? last.choices : undefined;
  const showSuggestions = loaded && messages.length === 0 && suggestions.length > 0;

  return (
    <div id="assistant">
      {!open ? (
        <button
          type="button"
          onClick={openPanel}
          aria-label={t.open}
          className="fixed bottom-[5.5rem] right-4 z-40 flex items-center justify-center gap-2 h-12 w-12 sm:h-14 sm:bottom-5 sm:right-5 sm:w-auto sm:pl-4 sm:pr-5 rounded-full bg-[var(--foreground)] text-[var(--background)] shadow-xl hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">{t.open}</span>
        </button>
      ) : null}

      {open ? (
        <section
          role="dialog"
          aria-label={assistant.name}
          className="fixed inset-x-0 bottom-0 z-[60] flex h-[85dvh] flex-col overflow-hidden border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[min(620px,calc(100dvh-3rem))] sm:w-[400px] rounded-t-2xl sm:rounded-2xl"
        >
          <header className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--muted)] px-4 py-3">
            <Avatar size={36} url={assistant.avatarUrl} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold leading-tight">{assistant.name}</p>
              <p className="truncate text-[11px] text-[var(--muted-foreground)]">{t.subtitle}</p>
            </div>
            {messages.length ? (
              <button
                type="button"
                onClick={() => void reset()}
                title={t.new_chat}
                aria-label={t.new_chat}
                className="flex h-8 w-8 items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.close}
              className="flex h-8 w-8 items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            <Bubble role="assistant" content={greeting} />
            {messages.map((m, i) => (
              <Bubble key={i} {...m} typing={t.typing} />
            ))}
            {showSuggestions ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-[var(--border)] px-3 py-1.5 text-left text-xs hover:border-[var(--foreground)] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
            {choices ? (
              <div className="space-y-2 pt-1">
                <div className="flex flex-wrap gap-2">
                  {choices.options.map((option) => {
                    const on = picked.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={choices.multiple ? on : undefined}
                        onClick={() => (choices.multiple ? setPicked((p) => (on ? p.filter((x) => x !== option) : [...p, option])) : void send(option))}
                        className={`border px-3 py-1.5 text-xs transition-colors ${on ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]" : "border-[var(--border)] hover:border-[var(--foreground)]"}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {choices.multiple && picked.length ? (
                  <button type="button" onClick={() => void send(picked.join(", "))} className="bg-[var(--foreground)] px-3 py-1.5 text-xs font-medium text-[var(--background)]">
                    {t.send}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          {error ? <p className="border-t border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-xs text-red-500">{error}</p> : null}

          <form
            className="flex items-end gap-2 border-t border-[var(--border)] bg-[var(--muted)] p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(draft);
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              maxLength={2000}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(draft);
                }
              }}
              className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-base sm:text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--foreground)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !draft.trim()}
              aria-label={t.send}
              className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)] disabled:opacity-30"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}

function Avatar({ size, url }: { size: number; url?: string | null }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)] overflow-hidden"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : <Sparkles className="w-1/2 h-1/2" />}
    </span>
  );
}

function Bubble({ role, content, files, pending, typing }: Message & { typing?: string }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          mine ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--muted)] border border-[var(--border)]"
        }`}
      >
        {pending ? (
          <span className="inline-flex gap-1 py-1" aria-label={typing}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-60" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </span>
        ) : mine ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="space-y-2 [&_strong]:font-semibold" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        )}
        {files?.length ? (
          <div className="mt-2 grid gap-2">
            {files.map((file, i) =>
              file.url && file.mediaType.startsWith("image/") ? (
                <a key={i} href={file.url} target="_blank" rel="noopener">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file.url} alt={file.name} className="max-h-56 w-full object-cover" />
                </a>
              ) : file.url ? (
                <a key={i} href={file.url} target="_blank" rel="noopener" className="underline">
                  {file.name}
                </a>
              ) : null
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** A button that opens the assistant, optionally with a prefilled message. */
export function AskAssistantButton({ label, prefill, className }: { label: string; prefill?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("bb:ask", { detail: prefill ?? "" }))}
      className={className}
    >
      <Sparkles className="w-4 h-4" />
      {label}
    </button>
  );
}
