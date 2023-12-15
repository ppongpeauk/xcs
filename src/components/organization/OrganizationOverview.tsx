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
  Space,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
  rem
} from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  Icon123,
  IconDeviceFloppy,
  IconDoorExit,
  IconDownload,
  IconHttpDelete,
  IconRecycle,
  IconTrash,
  IconUpload,
  IconUsersGroup
} from '@tabler/icons-react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { ResponsivePie } from '@nivo/pie';

const LineGraph = dynamic(() => import('./LineGraph'), { ssr: false }) as any;
const PieChart = dynamic(() => import('./PieChart'), { ssr: false }) as any;

const nivoTheme = {
  text: {
    fontSize: 11,
    fill: '#fff',
    outlineWidth: 0,
    outlineColor: 'transparent'
  }
};

const data = [
  {
    id: 'denied',
    label: 'Denied',
    value: 580
  },
  {
    id: 'granted',
    label: 'Granted',
    value: 161
  }
];

export default function OrganizationOverview({
  query,
  data: organization,
  refreshData
}: {
  query: any;
  data: Organization | any;
  refreshData: any;
}) {
  const { user } = useAuthContext();
  const { push } = useRouter();

  return (
    <>
      <Title
        order={2}
        py={4}
      >
        Overview
      </Title>
      <Flex
        w={'100%'}
        gap={16}
      >
        <Card
          mt={16}
          p={16}
          w={'420px'}
          h={'320px'}
          withBorder
        >
          <Title order={3}>Scans</Title>
          <PieChart
            data={data}
            theme={nivoTheme}
          />
        </Card>
        {/* <Card
          mt={16}
          w={'100%'}
          h={'320px'}
          withBorder
        >
          <LineGraph
            data={data}
            theme={nivoTheme}
          />
        </Card> */}
      </Flex>
    </>
  );
}
