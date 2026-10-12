/* Renders a schema.org JSON-LD block. Server component — the payload is built
   on the server and stamped straight into the HTML <head>/<body>. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // The payload is our own, built from static catalogue content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
