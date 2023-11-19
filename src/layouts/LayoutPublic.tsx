/*
 * Name: PublicLayout.tsx
 * Description: Layout for public-facing pages
 * Author: Pete Pongpeauk <pete@ppkl.dev>
 *
 * Copyright (c) 2023 Pete Pongpeauk and contributors
 * License: MIT License
 */

import Nav from '@/components/nav/PublicNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav main={children} />
    </>
  );
}
