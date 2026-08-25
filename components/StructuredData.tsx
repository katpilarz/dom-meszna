import { buildStructuredData } from '@/data/site';

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildStructuredData()) }}
    />
  );
}
