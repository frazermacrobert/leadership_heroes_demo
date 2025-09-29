import React from "react";

export default function InfoModal({
  open,
  onClose,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  categories: string[];
}) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed z-50 inset-0 grid place-items-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border p-5">
          <h3 className="text-lg font-semibold mb-2">About the deck</h3>
          <p className="text-sm text-gray-700">
            There are multiple categories of Leadership Heroes. Build a hand of{" "}
            <b>five</b> that fits your challenge. Click a card to{" "}
            <b>discard</b> it and draw a replacement.
          </p>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((c) => (
              <span
                key={c}
                className="text-xs px-2 py-1 rounded border bg-gray-50"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="px-3 py-1.5 rounded border shadow-sm hover:shadow"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
