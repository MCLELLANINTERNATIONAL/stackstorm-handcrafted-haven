export default function ProductReviewsPage() {
    return (
      <div className="max-w-5xl">
        <h1 className="text-2xl font-semibold">Product Reviews</h1>
        <p className="mt-2 text-gray-600">
          View ratings and written feedback customers left on your products.
        </p>
  
        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Latest Reviews</h2>
              <p className="mt-1 text-sm text-gray-600">
                Replace this placeholder with your database query + UI later.
              </p>
            </div>
  
            <div className="rounded-full bg-gray-50 px-4 py-2 text-sm">
              Average Rating: <span className="font-semibold">4.8</span>
            </div>
          </div>
  
          <div className="mt-6 space-y-4">
            {/* Review Card */}
            <div className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">Wooden Keepsake Box</p>
                  <p className="text-sm text-gray-600">by Customer A • Jan 2026</p>
                </div>
                <div className="text-sm font-semibold">★★★★★</div>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                Beautiful craftsmanship and fast shipping. Highly recommend!
              </p>
            </div>
  
            {/* Review Card */}
            <div className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">Handwoven Tote</p>
                  <p className="text-sm text-gray-600">by Customer B • Jan 2026</p>
                </div>
                <div className="text-sm font-semibold">★★★★☆</div>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                Lovely quality. The color was slightly different than expected, but still great.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  