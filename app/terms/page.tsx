// pages/terms.tsx
import Head from "next/head";
import Link from "next/link";
import "../terms.css"; // keep your CSS

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Service — Earthilians</title>
        <meta
          name="description"
          content="Earthilians Terms of Service — rules and conditions for using the service."
        />
      </Head>

      <main className="page container">
        <header className="page-head">
          <h1>Terms of Service</h1>
          <p className="muted">
            Last updated: <time>2025-09-13</time>
          </p>
        </header>

        <section>
          <h2>Acceptance</h2>
          <p>
            By using Earthilians (the Service) you agree to these Terms. If you do not agree, please do not use the Service.
          </p>
        </section>

        <section>
          <h2>Using the Service</h2>
          <ul>
            <li>You may use Earthilians for lawful purposes only.</li>
            <li>You agree not to attempt to harm the service, reverse engineer, or interfere with its operation.</li>
            <li>We may suspend or remove access for violations of these Terms.</li>
          </ul>
        </section>

        <section>
          <h2>Content and Intellectual Property</h2>
          <p>
            The Service returns links and snippets to third-party content. We do not own that content. All trademarks and copyrights
            remain the property of their respective owners.
          </p>
        </section>

        <section>
          <h2>Disclaimers and Limitation of Liability</h2>
          <p>
            The Service is provided as is without warranties of any kind. To the maximum extent permitted by law,
            Earthilians and its affiliates are not liable for indirect, incidental, special or consequential damages.
          </p>
        </section>

        <section>
          <h2>Termination</h2>
          <p>
            We may terminate or restrict access at any time for violations or for operational reasons.
          </p>
        </section>

        <section>
          <h2>Governing Law</h2>
          <p>
            These Terms are governed by the laws of the jurisdiction where Earthilians is registered. If you have questions, contact{" "}
            <a href="mailto:legal@earthilians.com">legal@earthilians.com</a>.
          </p>
        </section>

        <section>
          <h2>Changes to Terms</h2>
          <p>
            We may modify these Terms. Continued use after changes indicates acceptance. We will post the effective date above.
          </p>
        </section>

        <footer className="page-foot">
          <p>
            <Link href="/privacy">Privacy Policy</Link> · <Link href="/">Back to search</Link>
          </p>
        </footer>
      </main>
    </>
  );
}
