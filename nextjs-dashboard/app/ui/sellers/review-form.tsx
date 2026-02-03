'use client';

import { useState } from 'react';

export default function ReviewForm({ sellerId }: { sellerId: string }) {
  const [content, setContent] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ sellerId, content }),
    });

    setContent('');
    location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your review..."
        className="w-full rounded-md border p-2 text-sm"
        rows={4}
        required
      />

      <button
        type="submit"
        className="rounded-md bg-black px-4 py-2 text-sm text-white"
      >
        Submit review
      </button>
    </form>
  );
}

