import type { JsonLdSchema } from "./types";

interface JsonLdProps {
  /** A single schema object or an array of them. Arrays are emitted as
   * sibling `<script>` tags so each schema is validated independently. */
  schema: JsonLdSchema | readonly JsonLdSchema[] | null | undefined;
  /** Optional id for the underlying `<script>` tag — useful for testing. */
  id?: string;
}

/**
 * Reusable JSON-LD `<script>` renderer.
 *
 * Server component by design — no `"use client"`. Safe to render in both
 * layouts and pages. When `schema` is null/undefined we emit nothing so
 * callers can skip rendering without conditionals at the call site.
 */
export function JsonLd({ schema, id }: JsonLdProps) {
  if (!schema) return null;

  const schemas: readonly JsonLdSchema[] = Array.isArray(schema)
    ? schema
    : [schema as JsonLdSchema];

  return (
    <>
      {schemas.map((entry, index) => (
        <script
          key={id ? `${id}-${index}` : index}
          id={id ? `${id}-${index}` : undefined}
          type="application/ld+json"
           
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
    </>
  );
}
