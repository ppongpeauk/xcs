import { useAuthContext } from '@/contexts/AuthContext';
import { Location, Organization } from '@/types';
import { useDisclosure, useToast } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import {
  Avatar,
  Box,
  Button,
  Card,
  FileButton,
  Flex,
  Input,
  LoadingOverlay,
  Space,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
  rem
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AreaChart } from '@mantine/charts';

const data = [
  { date: 'Jan 1', Denied: 293, Granted: 149, Total: 442 },
  { date: 'Jan 2', Denied: 953, Granted: 257, Total: 1210 },
  { date: 'Jan 3', Denied: 88, Granted: 31, Total: 119 },
  { date: 'Jan 4', Denied: 291, Granted: 157, Total: 448 },
  { date: 'Jan 5', Denied: 131, Granted: 41, Total: 172 },
  { date: 'Jan 6', Denied: 528, Granted: 215, Total: 743 },
  { date: 'Jan 7', Denied: 985, Granted: 271, Total: 1256 },
  { date: 'Jan 8', Denied: 993, Granted: 281, Total: 1274 },
  { date: 'Jan 9', Denied: 362, Granted: 133, Total: 495 },
  { date: 'Jan 10', Denied: 513, Granted: 226, Total: 739 },
  { date: 'Jan 11', Denied: 735, Granted: 178, Total: 913 },
  { date: 'Jan 12', Denied: 291, Granted: 14, Total: 305 },
  { date: 'Jan 13', Denied: 824, Granted: 211, Total: 1035 },
  { date: 'Jan 14', Denied: 379, Granted: 48, Total: 427 },
  { date: 'Jan 15', Denied: 345, Granted: 211, Total: 556 },
  { date: 'Jan 16', Denied: 23, Granted: 68, Total: 91 },
  { date: 'Jan 17', Denied: 953, Granted: 237, Total: 1190 },
  { date: 'Jan 18', Denied: 636, Granted: 206, Total: 842 },
  { date: 'Jan 19', Denied: 859, Granted: 149, Total: 1008 },
  { date: 'Jan 20', Denied: 183, Granted: 138, Total: 321 },
  { date: 'Jan 21', Denied: 963, Granted: 238, Total: 1201 },
  { date: 'Jan 22', Denied: 40, Granted: 39, Total: 79 },
  { date: 'Jan 23', Denied: 575, Granted: 60, Total: 635 },
  { date: 'Jan 24', Denied: 927, Granted: 36, Total: 963 },
  { date: 'Jan 25', Denied: 50, Granted: 113, Total: 163 },
  { date: 'Jan 26', Denied: 815, Granted: 11, Total: 826 },
  { date: 'Jan 27', Denied: 420, Granted: 6, Total: 426 },
  { date: 'Jan 28', Denied: 37, Granted: 208, Total: 245 },
  { date: 'Jan 29', Denied: 684, Granted: 40, Total: 724 },
  { date: 'Jan 30', Denied: 718, Granted: 9, Total: 727 }
];

export default function OrganizationOverview({
  query,
  data: organization,
  refreshData
}: {
  query: any;
  data: Organization;
  refreshData: any;
}) {
  const { user } = useAuthContext();
  const { push } = useRouter();
  const [swipeData, setSwipeData] = useState<any>([]);

  useEffect(() => {
    if (organization) {
      setSwipeData([
        {
          id: 'denied',
          label: 'Denied',
          value: organization.statistics.scans.denied
        },
        {
          id: 'granted',
          label: 'Granted',
          value: organization.statistics.scans.granted
        }
      ]);
    }
  }, [organization]);

  return (
    <>
      <Title
        order={2}
        py={4}
      >
        Overview
      </Title>
      <Flex
        pos={'relative'}
        h={200}
      >
        <LoadingOverlay
          visible={false}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ size: 'md', color: 'var(--mantine-color-default-color)' }}
        />
        <AreaChart
          h={'100%'}
          data={data}
          title="Scans"
          dataKey="date"
          series={[
            { name: 'Granted', color: 'green.6' },
            { name: 'Denied', color: 'red.6' },
            { name: 'Total', color: 'blue.6' }
          ]}
          curveType="natural"
          gridAxis="xy"
          withLegend
        />
      </Flex>
    </>
  );
}
