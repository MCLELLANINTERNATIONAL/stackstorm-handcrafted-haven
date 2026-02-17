'use client';

import { useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type CategoryOption = { value: string; label: string };

export default function ProductFilters({
  categories,
  priceMinLimit = 0,
  priceMaxLimit = 500,
  showCategoryFilter = true,
}: {
  categories: CategoryOption[];
  priceMinLimit?: number;
  priceMaxLimit?: number;
  showCategoryFilter?: boolean; // ✅ optional now
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const initial = useMemo(() => {
    const q = searchParams.get('q') ?? '';
    const category = searchParams.get('category') ?? 'all';
    const minPrice = Number(searchParams.get('minPrice') ?? priceMinLimit);
    const maxPrice = Number(searchParams.get('maxPrice') ?? priceMaxLimit);

    return {
      q,
      category,
      minPrice: Number.isFinite(minPrice) ? minPrice : priceMinLimit,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : priceMaxLimit,
    };
  }, [searchParams, priceMinLimit, priceMaxLimit]);

  const [q, setQ] = useState(initial.q);
  const [category, setCategory] = useState(initial.category);
  const [minPrice, setMinPrice] = useState(initial.minPrice);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);

  function apply() {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('page');

    const qClean = q.trim();
    if (qClean) params.set('q', qClean);
    else params.delete('q');

    if (showCategoryFilter) {
      if (category && category !== 'all') params.set('category', category);
      else params.delete('category');
    } else {
      params.delete('category');
    }

    const min = Math.max(priceMinLimit, Math.min(minPrice, priceMaxLimit));
    const max = Math.max(priceMinLimit, Math.min(maxPrice, priceMaxLimit));
    const fixedMin = Math.min(min, max);
    const fixedMax = Math.max(min, max);

    params.set('minPrice', String(fixedMin));
    params.set('maxPrice', String(fixedMax));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function reset() {
    setQ('');
    setCategory('all');
    setMinPrice(priceMinLimit);
    setMaxPrice(priceMaxLimit);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.delete('category');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Search */}
        <div className="md:col-span-1">
          <label
            htmlFor="product-search"
            className="mb-1 block text-xs font-semibold text-gray-700"
          >
            Search
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="product-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-md border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Matches name, description, category, email, contact, price.
          </p>
        </div>

        {/* Category (only when enabled) */}
        <div className={showCategoryFilter ? '' : 'hidden'}>
          <label
            htmlFor="category-filter"
            className="mb-1 block text-xs font-semibold text-gray-700"
          >
            Category
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className={showCategoryFilter ? '' : 'md:col-span-2'}>
          <div className="mb-1 block text-xs font-semibold text-gray-700">
            Price range (£)
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="sr-only" htmlFor="minPrice">
              Minimum price
            </label>
            <input
              id="minPrice"
              type="number"
              value={minPrice}
              min={priceMinLimit}
              max={priceMaxLimit}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Min"
            />

            <label className="sr-only" htmlFor="maxPrice">
              Maximum price
            </label>
            <input
              id="maxPrice"
              type="number"
              value={maxPrice}
              min={priceMinLimit}
              max={priceMaxLimit}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Max"
            />
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Min: £{minPrice}</span>
              <span>Max: £{maxPrice}</span>
            </div>

            <label className="sr-only" htmlFor="minRange">
              Minimum price slider
            </label>
            <input
              id="minRange"
              type="range"
              min={priceMinLimit}
              max={priceMaxLimit}
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full"
            />

            <label className="sr-only" htmlFor="maxRange">
              Maximum price slider
            </label>
            <input
              id="maxRange"
              type="range"
              min={priceMinLimit}
              max={priceMaxLimit}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={apply}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600"
        >
          Apply filters
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
