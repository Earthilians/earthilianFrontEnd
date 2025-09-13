// pages/about.tsx
import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Earthilians</title>
        <meta
          name="description"
          content="About Earthilians — mission, values and how our search works."
        />
      </Head>

      <main className="page container">
        <header className="page-head">
          <h1>About Earthilians</h1>
          <p className="muted">
            A search engine by the users, for the users.
          </p>
        </header>

        <section>
          <h2>Our Mission</h2>
          <p>
            At a time when many popular search engines chase maximum revenue and clutter results with ads or AI-generated noise,
            Earthilians exists with a different focus. We are here to help people find the best pages on the web —
            the real information, resources, and help you need — quickly and without distractions.
          </p>
        </section>

        <section>
          <h2>How It Works</h2>
          <p>
            Our system crawls and indexes content across the web and integrates trusted sources. When you search,
            we query our index and return ranked results with speed and relevance. No endless ads, no manipulative tricks —
            just results that matter.
          </p>
        </section>

        <section>
          <h2>Values</h2>
          <ul>
            <li>
              <strong>Privacy:</strong> We minimize data collection and never sell your information.
            </li>
            <li>
              <strong>Transparency:</strong> Clear about how our search works and what drives results.
            </li>
            <li>
              <strong>Performance:</strong> Fast, lightweight search designed for everyone, everywhere.
            </li>
            <li>
              <strong>Human-first:</strong> Built to serve people, not advertisers or algorithms chasing engagement.
            </li>
          </ul>
        </section>

        <section>
          <h2>Team and Community</h2>
          <p>
            Earthilians is built by a small independent team and supported by contributors worldwide.
            If you would like to help shape a better search experience,
            check <Link href="/open-source">our repo</Link> or email{" "}
            <a href="mailto:hello@earthilians.com">hello@earthilians.com</a>.
          </p>
        </section>
      </main>
    </>
  );
}
