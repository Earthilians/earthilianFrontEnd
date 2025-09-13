// pages/privacy.tsx
import Head from "next/head";
import Link from "next/link";
import "../privacy.css"; // keep your CSS

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Earthilians</title>
        <meta name="description" content="Earthilians Privacy Policy — how we collect, use and protect data." />
      </Head>

      <main className="page container">
        <header className="page-head">
          <h1>Privacy Policy</h1>
          <p className="muted">Last updated: <time>2025-09-13</time></p>
        </header>

        <section>
          <h2>Overview</h2>
          <p>
            Earthilians (we, our, us) respects your privacy. This Privacy Policy explains how we collect,
            use, disclose, and protect information when you use our search service at <strong>earthilians.com</strong>.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <ul>
            <li><strong>Search queries:</strong> We may temporarily store search terms to deliver results and improve service.</li>
            <li><strong>Usage data:</strong> Non-personal telemetry (e.g. page views, response times) to monitor & improve performance.</li>
            <li><strong>Device & browser info:</strong> IP address (anonymized), user agent, and locale for routing and diagnostics.</li>
            <li><strong>Optional account data:</strong> If you create an account (when available), we store profile info you provide.</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Information</h2>
          <p>We use collected data to:</p>
          <ul>
            <li>Serve and rank search results.</li>
            <li>Prevent abuse and detect fraud.</li>
            <li>Analyze and improve product performance and reliability.</li>
            <li>Communicate with you about updates or support (when you provide contact info).</li>
          </ul>
        </section>

        <section>
          <h2>Cookies & Similar Technologies</h2>
          <p>
            We use small cookies or local storage only when necessary (e.g. preferences, sessions). We do not use tracking cookies for advertising.
          </p>
        </section>

        <section>
          <h2>Third Parties</h2>
          <p>
            We may use third-party services (analytics, hosting, search indexing) that process limited data on our behalf.
            We review and require partners to follow applicable privacy and security practices.
          </p>
        </section>

        <section>
          <h2>Data Retention & Deletion</h2>
          <p>
            We retain data only as long as necessary. If you request deletion of personal data, we will comply subject to
            legal obligations and technical constraints. To request deletion, contact: <a href="mailto:privacy@earthilians.com">privacy@earthilians.com</a>
          </p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>
            Depending on your jurisdiction you may have rights to access, correct, or delete personal data. To exercise these rights,
            email <a href="mailto:privacy@earthilians.com">privacy@earthilians.com</a>.
          </p>
        </section>

        <section>
          <h2>Children</h2>
          <p>
            Earthilians is not intended for children under 13. We do not knowingly collect personal information from children.
          </p>
        </section>

        <section>
          <h2>Changes to this Policy</h2>
          <p>
            We may update this policy. We will post a prominent notice when major changes occur and update the Last updated date.
          </p>
        </section>

        <footer className="page-foot">
          <p>Questions? Contact us at <a href="mailto:privacy@earthilians.com">privacy@earthilians.com</a></p>
          <p><Link href="/">Back to search</Link></p>
        </footer>
      </main>
    </>
  );
}
