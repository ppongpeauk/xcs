/*
 * Name: NavAsideContext.tsx
 * Description: Context for the navigation aside, which is used for help and other things
 * Author: Pete Pongpeauk <pete@ppkl.dev>
 *
 * Copyright (c) 2023 Pete Pongpeauk and contributors
 * License: MIT License
 */

import { useDisclosure } from '@mantine/hooks';
import { createContext, useContext, useState } from 'react';

const NavAsideContext = createContext(null);

export function useAsideContext() {
  return useContext(NavAsideContext) as any;
}

export default function NavAsideProvider({ children }: { children: React.ReactNode }) {
  const [asideOpened, { toggle: asideToggle, open: asideOpen, close: asideClose }] = useDisclosure(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<React.ReactNode>('');

  const openHelp = ({ title, description }: { title: string; description: React.ReactNode }) => {
    asideOpen();
    setTitle(title);
    setDescription(description);
  };

  const closeHelp = () => {
    asideClose();
    // setTitle('');
    // setDescription('');
  };

  const values = { asideOpened, asideToggle, asideOpen, asideClose, openHelp, closeHelp, title, description };

  return <NavAsideContext.Provider value={values as any}>{children}</NavAsideContext.Provider>;
}
