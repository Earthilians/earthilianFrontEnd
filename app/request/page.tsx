"use client";

// pages/request-index.tsx
import Head from "next/head";
import { useState } from "react";
import "../request.css"; // keep your CSS


export default function RequestIndexPage() {
  const [domain, setDomain] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      // Placeholder — replace with real API
      await new Promise((res) => setTimeout(res, 1200));
      setStatus("success");
      setDomain("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <>
      <Head>
        <title>Request Indexing — Earthilians</title>
        <meta
          name="description"
          content="Submit your domain for indexing on Earthilians Search."
        />
      </Head>

      <main className="page container">
        <header className="page-head">
          <h1>Request Indexing</h1>
          <p className="muted">
            Submit your domain for indexing in Earthilians Search.
          </p>
        </header>

        <section>
          <h2>How It Works</h2>
          <p>
            You can request indexing of your website or domain here. When you submit, we securely record your request to ensure
            it comes from a genuine user and to prevent abuse or overutilization of our resources by a single user or automated bot.
          </p>
          <p>
            Once verified, your domain will be reviewed and queued for crawling and indexing.
          </p>
        </section>

        <section>
          <h2>Submit Your Domain</h2>
          <form className="request-form" onSubmit={handleSubmit}>
            <label htmlFor="domain">Domain</label>
            <input
              id="domain"
              type="url"
              placeholder="https://example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
            <button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Submitting…" : "Submit Request"}
            </button>
          </form>

          {status === "success" && (
            <div className="form-msg success">
              ✅ Your request has been submitted successfully.
            </div>
          )}
          {status === "error" && (
            <div className="form-msg error">
              ❌ Something went wrong. Please try again later.
            </div>
          )}
        </section>
      </main>
    </>
  );
}
