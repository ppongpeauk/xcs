/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "@/layouts/PlatformLayout";
import { Container, Divider, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";

import { ChevronRightIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";

import { useAuthContext } from "@/contexts/AuthContext";

import DeleteDialog from "@/components/DeleteDialog";
import LocationAccessPoints from "@/components/LocationAccessPoints";
import LocationEventLogs from "@/components/LocationEventLogs";
import LocationInfo from "@/components/LocationInfo";
import { useToast } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { AiFillTag } from "react-icons/ai";
import {
  BiSolidGroup,
  BiSolidTime,
  BiSolidTrafficBarrier,
} from "react-icons/bi";
import { BsFillCloudDownloadFill } from "react-icons/bs";
import { IoIosRemoveCircle } from "react-icons/io";
import { IoBusiness } from "react-icons/io5";
import { MdSensors } from "react-icons/md";
import { SiRoblox } from "react-icons/si";

function StyledTab({ children }: { children: React.ReactNode }) {
  return (
    <Tab
      fontSize={["sm", "md"]}
      color={"unset"}
      justifyContent={"left"}
      border={"none"}
      rounded={"xl"}
      fontWeight={"bold"}
      _hover={{
        bg: useColorModeValue("gray.100", "gray.700"),
      }}
      _selected={{
        bg: useColorModeValue("gray.100", "#fff"),
        color: useColorModeValue("black", "gray.900"),
      }}
      _active={{
        bg: useColorModeValue("gray.200", "gray.300"),
        color: useColorModeValue("gray.900", "gray.900"),
      }}
    >
      {children}
    </Tab>
  );
}

export default function PlatformLocation() {
  const router = useRouter();
  const { query, push } = router;
  const { user } = useAuthContext();
  const [idToken, setIdToken] = useState<string | null>(null);
  const [location, setLocation] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const toast = useToast();

  let refreshData = () => {
    setLocation(null);
    fetch(`/api/v1/locations/${query.id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${idToken}` },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        if (res.status === 404) {
          return push("/404");
        } else if (res.status === 403 || res.status === 401) {
          toast({
            title: "Unauthorized",
            description: "You are not authorized to view this location.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return push("/platform/organizations");
        }
      })
      .then((data) => {
        setLocation(data.location);
      });
  };

  // Fetch location data
  useEffect(() => {
    if (!idToken) return;
    if (!query.id) return;
    refreshData();
  }, [query.id, idToken]);

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token: string) => {
      setIdToken(token);
    });
  }, [user]);

  const indexSwitch = (index: number) => {
    let route = "";
    switch (index) {
      case 0:
        route = `/platform/locations/${query.id}/general`;
        break;
      case 1:
        route = `/platform/locations/${query.id}/event-logs`;
        break;
      case 2:
        route = `/platform/locations/${query.id}/members`;
        break;
      case 3:
        route = `/platform/locations/${query.id}/access-points`;
        break;
      default:
        route = `/platform/locations/${query.id}/general`;
        break;
    }
    return route;
  };

  useEffect(() => {
    if (!query.tab) return;
    if (query.tab[0] === "general") setTabIndex(0);
    else if (query.tab[0] === "event-logs") setTabIndex(1);
    else if (query.tab[0] === "members") setTabIndex(2);
    else if (query.tab[0] === "access-points") setTabIndex(3);
  }, [query.tab]);

  const onTabChange = (index: number) => {
    push(indexSwitch(index), undefined, { scroll: false });
  };

  return (
    <>
      <Head>
        <title>EVE XCS — {location?.name}</title>
        <meta property="og:title" content="EVE XCS - Manage Location" />
        <meta property="og:site_name" content="EVE XCS" />
        <meta property="og:url" content="https://xcs.restrafes.co" />
        <meta property="og:type" content="website" />
        {/* <meta property="og:image" content="/images/hero3.jpg" />
        <meta name="twitter:card" content="summary_large_image" /> */}
      </Head>
      <Container maxW={"full"} p={8}>
        <Breadcrumb
          display={["none", "flex"]}
          spacing="8px"
          mb={4}
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink
              as={NextLink}
              href="/platform/home"
              textUnderlineOffset={4}
            >
              Platform
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={NextLink}
              href={`/platform/organizations/${location?.organization.id}`}
              textUnderlineOffset={4}
            >
              {location?.organization.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={NextLink}
              href={`/platform/locations?organization=${location?.organization.id}`}
              textUnderlineOffset={4}
            >
              Locations
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#" textUnderlineOffset={4}>
              {location?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading>{location?.name}</Heading>
        <Text fontSize={"lg"} color={"gray.500"}>
          {location?.organization.name}
        </Text>
        <Divider my={4} />
        <Tabs
          py={4}
          orientation="vertical"
          variant={"line"}
          isLazy={true}
          index={tabIndex}
          onChange={(index) => onTabChange(index)}
          h={"100%"}
        >
          <TabList w={"240px"} h={"100%"} border={"none"}>
            <StyledTab>
              <IoBusiness />
              <Text ml={2}>General</Text>
            </StyledTab>
            <StyledTab>
              <BiSolidTime />
              <Text ml={2}>Event Logs</Text>
            </StyledTab>
            <StyledTab>
              <BiSolidGroup />
              <Text ml={2}>Members</Text>
            </StyledTab>
            <StyledTab>
              <MdSensors />
              <Text ml={2}>Access Points</Text>
            </StyledTab>
          </TabList>

          <TabPanels px={8}>
            <TabPanel p={0}>
              <LocationInfo
                idToken={idToken}
                query={query}
                location={location}
                refreshData={refreshData}
              />
            </TabPanel>
            <TabPanel p={0}>
              <LocationEventLogs
              // idToken={idToken}
              // query={query}
              // location={location}
              // refreshData={refreshData}
              />
            </TabPanel>
            <TabPanel p={0}>
              <p>three!</p>
            </TabPanel>
            <TabPanel p={0}>
              <LocationAccessPoints
                idToken={idToken}
                location={location}
                refreshData={refreshData}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
}

PlatformLocation.getLayout = (page: any) => <Layout>{page}</Layout>;
