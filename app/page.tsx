"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import "./search.css"; // keep your CSS
import Image from "next/image";
import Link from "next/link";


const WORKER_BASE = "https://meili-edge-proxy.franklinsafe-developer.workers.dev";

type Hit = {
  id: string;
  url: string;
  title?: string;
  description?: string;
  _formatted?: { title?: string; description?: string };
};

type SearchResponse = {
  hits?: Hit[];
  estimatedTotalHits?: number;
  processingTimeMs?: number;
};

function domainFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function faviconFor(url: string) {
  try {
    return new URL(url).origin + "/favicon.ico";
  } catch {
    return "";
  }
}

function isAbortError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    (err as { name?: string }).name === "AbortError"
  );
}


export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Hit[]>([]);
  const [results, setResults] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 10;
  const [totalHits, setTotalHits] = useState<number | null>(null);
  const [backendProvidedTotal, setBackendProvidedTotal] = useState<boolean | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [stats, setStats] = useState("");

  const requestIdRef = useRef(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [inputFocused, setInputFocused] = useState(false);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());


  // Abort controller for suggestions
  const suggAbortRef = useRef<AbortController | null>(null);

  // Suggestion fetch: abortable, only when input is focused and query exists
  useEffect(() => {
    // cancel any previous
    if (suggAbortRef.current) {
      suggAbortRef.current.abort();
      suggAbortRef.current = null;
    }

    if (!query || !inputFocused) {
      setSuggestions([]);
      setActiveSuggestion(-1);
      return;
    }

    const controller = new AbortController();
    suggAbortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${WORKER_BASE}/suggest?q=${encodeURIComponent(query)}&limit=6&_ts=${Date.now()}`,
          { signal: controller.signal }
        );
        const data: SearchResponse = await res.json();
        if (!controller.signal.aborted) {
          setSuggestions(data.hits ?? []);
          setActiveSuggestion(-1);
        }
      } catch (err: unknown) {
        if (isAbortError(err)) {
          // aborted - ignore
        } else {
          setSuggestions([]);
          setActiveSuggestion(-1);
        }
      }
    }, 140);

    return () => {
      clearTimeout(timer);
      controller.abort();
      suggAbortRef.current = null;
    };
  }, [query, inputFocused]);

  // async function doSearch(p = 0) {
  //   const q = query.trim();
  //   if (!q) {
  //     // clear results if no query
  //     setResults([]);
  //     setSuggestions([]);
  //     setActiveSuggestion(-1);
  //     return;
  //   }

  //   // abort any outstanding suggestion fetch and hide suggestions immediately
  //   if (suggAbortRef.current) {
  //     suggAbortRef.current.abort();
  //     suggAbortRef.current = null;
  //   }
  //   setSuggestions([]);
  //   setActiveSuggestion(-1);

  //   setLoading(true);
  //   const localRequestId = ++requestIdRef.current;
  //   try {
  //     const offset = p * limit;
  //     const url = `${WORKER_BASE}/search?q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}&_ts=${Date.now()}`;
  //     const res = await fetch(url, { cache: "no-store" });
  //     const data: SearchResponse = await res.json();

  //     // stale guard
  //     if (localRequestId !== requestIdRef.current) return;

  //     const hits = data.hits ?? [];
  //     const provided = typeof data.estimatedTotalHits === "number";
  //     setBackendProvidedTotal(provided);

  //     if (p === 0) {
  //       setResults(hits);
  //     } else {
  //       setResults((prev) => {
  //         const prevIds = new Set(prev.map((r) => r.id));
  //         const filtered = hits.filter((h) => !prevIds.has(h.id));
  //         return [...prev, ...filtered];
  //       });
  //     }

  //     if (provided) {
  //       const total = data.estimatedTotalHits as number;
  //       setTotalHits(total);
  //       setHasMore(offset + hits.length < total);
  //       setStats(`${total.toLocaleString()} results • ${data.processingTimeMs ?? 0} ms`);
  //     } else {
  //       setTotalHits(null);
  //       setHasMore(hits.length === limit);
  //       setStats(`${p * limit + hits.length} shown • ${data.processingTimeMs ?? 0} ms`);
  //     }

  //     setPage(p);
  //     setSuggestions([]);
  //     setActiveSuggestion(-1);

  //     if (p === 0) window.scrollTo({ top: 0, behavior: "smooth" });
  //   } catch (err: unknown) {
  //     console.error("search error", err);
  //     setResults([]);
  //     setStats("0 results • 0 ms");
  //     setTotalHits(0);
  //     setHasMore(false);
  //     setBackendProvidedTotal(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
async function doSearch(p = 0) {
  const q = query.trim();
  if (!q) {
    // clear results if no query
    setResults([]);
    setSuggestions([]);
    setActiveSuggestion(-1);
    setTotalHits(null);
    setHasMore(false);
    setStats("");
    return;
  }

  // abort any outstanding suggestion fetch and hide suggestions immediately
  if (suggAbortRef.current) {
    suggAbortRef.current.abort();
    suggAbortRef.current = null;
  }
  setSuggestions([]);
  setActiveSuggestion(-1);

  setLoading(true);
  const localRequestId = ++requestIdRef.current;
  try {
    const offset = p * limit;
    const url = `${WORKER_BASE}/search?q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}&_ts=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    const data: SearchResponse = await res.json();

    // stale guard
    if (localRequestId !== requestIdRef.current) return;

    const hits = data.hits ?? [];
    const provided = typeof data.estimatedTotalHits === "number";
    setBackendProvidedTotal(provided);

    // update results (dedupe when appending)
    if (p === 0) {
      setResults(hits);
    } else {
      setResults((prev) => {
        const prevIds = new Set(prev.map((r) => r.id));
        const filtered = hits.filter((h) => !prevIds.has(h.id));
        return [...prev, ...filtered];
      });
    }

    // Decide hasMore / totalHits / stats robustly
    if (provided) {
      const total = data.estimatedTotalHits as number;
      setTotalHits(total);

      // If backend reports zero total, turn off pagination
      if (total === 0) {
        setHasMore(false);
        setStats(`0 results • ${data.processingTimeMs ?? 0} ms`);
      } else {
        setHasMore(offset + hits.length < total);
        setStats(`${total.toLocaleString()} results • ${data.processingTimeMs ?? 0} ms`);
      }
    } else {
      // backend didn't provide total — infer from returned hits
      setTotalHits(null);

      // If first page returned zero hits, no pagination
      if (p === 0 && hits.length === 0) {
        setHasMore(false);
        setStats(`0 results • ${data.processingTimeMs ?? 0} ms`);
      } else {
        // If returned fewer than limit, we've reached end
        setHasMore(hits.length === limit);
        setStats(`${p * limit + hits.length} shown • ${data.processingTimeMs ?? 0} ms`);
      }
    }

    setPage(p);
    setSuggestions([]);
    setActiveSuggestion(-1);

    if (p === 0) window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err: unknown) {
    console.error("search error", err);
    setResults([]);
    setStats("0 results • 0 ms");
    setTotalHits(0);
    setHasMore(false);
    setBackendProvidedTotal(null);
  } finally {
    setLoading(false);
  }
}

  async function recordClick(id: string, url: string) {
    // best-effort click recording (fire-and-forget)
    try {
      void fetch(`${WORKER_BASE}/click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      // ignore errors
    }
    window.open(url, "_blank", "noopener");
  }

  function chooseSuggestion(hit: Hit) {
    setQuery((hit.title || "").replace(/<\/?.*?>/g, ""));
    setSuggestions([]);
    setActiveSuggestion(-1);
    // short delay so UI updates before search
    setTimeout(() => doSearch(0), 20);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((s) => Math.min(s + 1, suggestions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion((s) => Math.max(s - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
          chooseSuggestion(suggestions[activeSuggestion]);
          return;
        }
        doSearch(0);
      }
      if (e.key === "Escape") {
        setSuggestions([]);
        setActiveSuggestion(-1);
      }
    } else {
      if (e.key === "Enter") doSearch(0);
    }
  }

  // pagination helpers
  const total = totalHits ?? 0;
  const totalPages = backendProvidedTotal ? Math.max(0, Math.ceil(total / limit)) : 0;
  function paginationRange() {
    const maxButtons = 7;
    if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i);
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(0, page - half);
    let end = start + maxButtons - 1;
    if (end >= totalPages) {
      end = totalPages - 1;
      start = Math.max(0, end - (maxButtons - 1));
    }
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }

  return (
    <div className="hp-root">
      <div className="hp-container">
        <header className="hp-header">
          <div className="hp-brand">
            {/* <Sparkles className="hp-spark" /> */}
  <Image
  src="/icon.png"
  alt="Earthilians Logo"
  width={100}
  height={100}
  className="hp-spark"
  priority
  unoptimized // prevents WebP conversion & compression
/>

            <div className="hp-brand-texts">
              <h1>Earthilians Search</h1>
  <p>A Search Engine by the Users, for the Users.</p>
            </div>
          </div>
        </header>

        {/* <section className="hp-search-card" aria-label="Search">
          <div className="hp-search-row">
            <Search className="hp-search-ico" />
            <input
              ref={inputRef}
              className="hp-input"
              placeholder='Search the site — try "google", "gmail"...'
              value={query}
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setQuery(ev.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => {
                // allow click on suggestion (mousedown handles selection)
                setTimeout(() => {
                  setInputFocused(false);
                  setSuggestions([]);
                  setActiveSuggestion(-1);
                }, 120);
              }}
              aria-autocomplete="list"
              aria-controls="suggestions-list"
              aria-activedescendant={activeSuggestion >= 0 ? `sugg-${activeSuggestion}` : undefined}
            />
            <button className="hp-search-btn" onClick={() => doSearch(0)} aria-label="Search" disabled={loading}>
              {loading ? <Loader2 className="hp-spin" /> : <span className="hp-search-go-icon">Search</span>}
            </button>
          </div>

          {/* suggestions only when input focused 
          {inputFocused && suggestions.length > 0 && (
            <div id="suggestions-list" className="hp-suggestions" role="listbox">
              {suggestions.map((s, i) => (
                <button
                  key={s.id}
                  id={`sugg-${i}`}
                  className={`hp-sugg ${i === activeSuggestion ? "active" : ""}`}
                  onMouseEnter={() => setActiveSuggestion(i)}
                  onMouseDown={(ev: React.MouseEvent<HTMLButtonElement>) => {
                    // use mouseDown so selection happens before blur
                    ev.preventDefault();
                    chooseSuggestion(s);
                  }}
                  role="option"
                  aria-selected={i === activeSuggestion}
                >
                  <div className="hp-sugg-title" dangerouslySetInnerHTML={{ __html: s._formatted?.title ?? s.title ?? "" }} />
                  <div className="hp-sugg-desc" dangerouslySetInnerHTML={{ __html: s._formatted?.description ?? s.description ?? "" }} />
                </button>
              ))}
            </div>
          )}

          <div className="hp-meta">
            <div>{stats || "No search yet"}</div>
            <div>limit: {limit}</div>
          </div>
        </section> */}

<section className="hp-search-card" aria-label="Search">
  <div className="hp-search-row simple" role="search">
    <div className="hp-search-left" aria-hidden="true">
      <Search className="hp-search-ico" />
    </div>

    <input
      ref={inputRef}
      className="hp-input-simple"
      placeholder='Type to discover the web…'
      value={query}
      onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setQuery(ev.target.value)}
      onKeyDown={handleKeyDown}
      onFocus={() => setInputFocused(true)}
      onBlur={() => {
        // small delay to allow suggestion click
        setTimeout(() => {
          setInputFocused(false);
          setSuggestions([]);
          setActiveSuggestion(-1);
        }, 120);
      }}
      aria-autocomplete="list"
      aria-controls="suggestions-list"
      aria-activedescendant={activeSuggestion >= 0 ? `sugg-${activeSuggestion}` : undefined}
    />

 <button
  className={`hp-rotate-btn ${loading ? "loading" : ""}`}
  onClick={() => doSearch(0)}
  aria-label="Search"
  disabled={loading}
  title="Search"
>
  {loading ? (
  <Loader2 className="hp-btn-loader" aria-hidden="true" />
) : (
  <Image
    src="/arrow.png"
    alt="Search"
    width={33}
    height={33}
    aria-hidden="true"
  />
)}

</button>

  </div>

  {inputFocused && suggestions.length > 0 && (
    <div id="suggestions-list" className="hp-suggestions simple" role="listbox">
      {suggestions.map((s, i) => (
        <button
          key={s.id}
          id={`sugg-${i}`}
          className={`hp-sugg ${i === activeSuggestion ? "active" : ""}`}
          onMouseEnter={() => setActiveSuggestion(i)}
          onMouseDown={(ev: React.MouseEvent<HTMLButtonElement>) => {
            // select before blur
            ev.preventDefault();
            chooseSuggestion(s);
          }}
          role="option"
          aria-selected={i === activeSuggestion}
        >
          <div className="hp-sugg-title" dangerouslySetInnerHTML={{ __html: s._formatted?.title ?? s.title ?? "" }} />
          <div className="hp-sugg-desc" dangerouslySetInnerHTML={{ __html: s._formatted?.description ?? s.description ?? "" }} />
        </button>
      ))}
    </div>
  )}

  <div className="hp-meta">
    <div className="hp-stats">{stats || ""}</div>
    {/* <div className="hp-limit">limit: {limit}</div> */}
  </div>
</section>

        <section className="hp-results" aria-live="polite">
<div className="hp-grid">
  {results.map((r, i) => {
    // compute friendly domain label
    let hostname = "";
    try { hostname = new URL(r.url).hostname.replace(/^www\./, ""); } catch (e) { hostname = r.url; }
    const domain = hostname.split(".")[0].replace(/[^a-zA-Z0-9]+/g," ").trim()
      .split(" ").map(w => w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(" ");

    return (
      <motion.article
        key={r.id}
        className="hp-card"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.02 }}
      >
        {/* FAVICON — sits in column 1 row 1 */}
        <img
          className="hp-fav-small"
          src={faviconFor(r.url) || ""}
          alt=""
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'><rect width='100%' height='100%' fill='%231f1f22'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23fff' font-size='14'>E</text></svg>";
          }}
          loading="lazy"
        />

        {/* TOP ROW (col 2 row 1): two small links stacked */}
        <div className="hp-link-rows">
          <a
            className="hp-small-link-Title hp-link-line1"
            href={r.url}
            onClick={(ev)=>{ ev.preventDefault(); recordClick(r.id, r.url); }}
            title={domain}
            target="_blank"
            rel="noopener noreferrer"
          >
            {domain}
          </a>

          <a
            className="hp-small-link hp-link-line2"
            href={r.url}
            onClick={(ev)=>{ ev.preventDefault(); recordClick(r.id, r.url); }}
            title={r.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {r.url}
          </a>
        </div>

        {/* CONTENT (col 2 row 2) — title + desc + footer — this starts directly below the favicon */}
        <div className="hp-content">
          <a
            className="hp-title"
            href={r.url}
            onClick={(ev)=>{ ev.preventDefault(); recordClick(r.id, r.url); }}
            target="_blank"
            rel="noopener noreferrer"
            dangerouslySetInnerHTML={{ __html: r._formatted?.title ?? r.title ?? "Untitled" }}
          />
          <div className="hp-desc" title={r._formatted?.description ?? r.description ?? ""}>
            {r._formatted?.description ?? r.description ?? ""}
          </div>
          <div className="hp-footer">
            <div className="hp-id">ID: {r.id.slice(0,8)}</div>
          </div>
        </div>
      </motion.article>
    );
  })}
</div>


      {loading && (
  <div className="hp-loading">
    <Loader2 className="hp-spin" aria-hidden="true" />
    <span>Searching</span>
  </div>
)}


          <nav className="hp-pagination" aria-label="Pagination">
            {backendProvidedTotal ? (
              <div className="hp-pages">
                {paginationRange().map((p) => (
                  <button
                    key={p}
                    onClick={() => doSearch(p)}
                    className={`hp-page ${p === page ? "active" : ""}`}
                    aria-current={p === page}
                    disabled={p === page || loading}
                  >
                    {p + 1}
                  </button>
                ))}
              </div>
            ) : hasMore ? (
              <div className="hp-load-more-wrap">
                <button className="hp-load-more" onClick={() => doSearch(page + 1)} disabled={loading}>
                  {loading ? "Loading…" : "Load more"}
                </button>
              </div>
            ) : results.length > 0 ? (
              <div className="hp-no-more">No more results</div>
            ) : null}
          </nav>
        </section>
      </div>


<footer className="site-footer" role="contentinfo" aria-label="Footer">
  <div className="footer-row">
    <nav className="footer-links" aria-label="Footer links">
      <Link href="/about">About</Link>
      <Link href="/privacy">Privacy</Link>
      <Link href="/terms">Terms</Link>
      <Link href="/request">Request Index</Link>
    </nav>

    <div className="footer-spacer" />

    <div className="footer-copy">© {year} Earthilians</div>
  </div>
</footer>


      
    </div>
  );
}
