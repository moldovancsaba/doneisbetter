"use client";

import React from 'react';
import EditCardForm from '@/components/EditCardForm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditCardPage({ params }: any) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Card</h1>
      <EditCardForm md5={params.md5} />
    </div>
  );
}
