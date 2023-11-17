import { useAsideContext } from '@/contexts/NavAsideContext';
import { Anchor } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export default function InfoLink({ title, description }: { title: string; description: React.ReactNode }) {
  const { openHelp } = useAsideContext();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <Anchor
        display={isMobile ? 'none' : 'unset'}
        onClick={() =>
          openHelp({
            title,
            description
          })
        }
        size="sm"
        ml={8}
      >
        Info
      </Anchor>
    </>
  );
}
