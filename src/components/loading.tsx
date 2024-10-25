'use client'

import React from 'react'
import Image from 'next/image'

interface LoadingProps {
  gifSrc: string
  overlayOpacity?: number
  gifSize?: number
}

export default function Loading({
  gifSrc,
  overlayOpacity = 0.7,
  gifSize = 100
}: LoadingProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
      <div className="relative">
        <Image
          src={gifSrc}
          alt="Loading"
          width={gifSize}
          height={gifSize}
          className="rounded-full"
        />
      </div>
      <span className="sr-only">Carregando...</span>
    </div>
  )
}