import Link from 'next/link';

type PageProps = {
  params: { id: string };
};

export default function ProductPage({ params }: PageProps) {
  return (
    <main className="max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">Product Reviews</h1>

      <Link
        href={`/dashboard/sellers/profile/${params.id}`}
        className="underline"
      >
        Back to seller profile
      </Link>
    </main>
  );
}
