import Layout from "@/layouts/PublicLayout";
import { getAllPostIds, getPostData } from "@/lib/posts";
import { Avatar, Container, Divider, Flex, Heading, Text, chakra } from "@chakra-ui/react";
import moment from "moment";
import Head from "next/head";
import Markdown from "react-markdown";

export async function getStaticPaths() {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }: any) {
    const postData = await getPostData(params.id as string);
    return {
        props: {
            postData,
        },
    };
}

export default function Post({ postData }: any) {
    return (
        <>
            <Head>
                <style>
                    {
                        `
                    .markdown > * {
                        all: revert;
                      }
                    
                    .markdown img {
                        margin: 1.5rem 0;
                        border-radius: 8px;
                    }
                    `
                    }
                </style>
            </Head>
            <Container maxW={'container.lg'} minH={'calc(100vh - 6rem)'} pt={16}>
                <Flex>
                    <Heading>
                        {postData.title}
                    </Heading>
                </Flex>
                <Flex align={'center'} py={6}>
                    <Avatar
                        size={'lg'}
                        name={postData.author}
                        src={postData.authorImage}
                        mr={4}
                    />
                    <Flex flexDir={'column'}>
                        <Text>
                            Written by <strong>{postData.author}</strong>
                        </Text>
                        <Text>
                            on {moment(postData.date).format('MMMM Do, YYYY')}
                        </Text>
                    </Flex>
                </Flex>
                <Divider />
                <chakra.div py={3}>
                    <Markdown className={"markdown"}>
                        {postData.content}
                    </Markdown>
                </chakra.div>
            </Container>
        </>
    );
}

Post.getLayout = (page: any) => <Layout>{page}</Layout>;