'use client'

import { useMemo, useState } from 'react'

import TeachingCard from '@/components/teaching-card'
import type { PublicTeachingItem } from '@/types/public'

const PAGE_SIZE = 5

export default function TeachingPortfolioList({
  teaching,
}: {
  teaching: PublicTeachingItem[]
}) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(
    1,
    Math.ceil(teaching.length / PAGE_SIZE)
  )

  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, teaching.length)

  const visibleTeaching = useMemo(
    () => teaching.slice(start, end),
    [end, start, teaching]
  )

  return (
    <>
      <div className="teaching-list">
        {visibleTeaching.map((item, pageIndex) => {
          const overallIndex = start + pageIndex

          return (
            <TeachingCard
              key={
                item.name +
                '-' +
                item.institution +
                '-' +
                (item.start_year ?? 'undated') +
                '-' +
                overallIndex
              }
              item={item}
              imageSide={
                overallIndex % 2 === 0 ? 'left' : 'right'
              }
            />
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="conference-pagination teaching-pagination">
          <p>
            Showing {start + 1}–{end} of {teaching.length}
          </p>

          <div className="conference-pagination-controls">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
            >
              Previous
            </button>

            <span>
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() =>
                setPage((current) =>
                  Math.min(totalPages, current + 1)
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  )
}
