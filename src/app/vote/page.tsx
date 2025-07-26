"use client";

import React, { Suspense } from 'react';
import Vote from '@/components/Vote';

function Loading() {
  return <h2>Loading...</h2>;
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Vote />
    </Suspense>
  );
}
