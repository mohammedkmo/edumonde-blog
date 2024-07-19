import type { Metadata, ResolvingMetadata } from "next";
import { groq, type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Avatar from "../../avatar";
import CoverImage from "../../cover-image";
import DateComponent from "../../date";
import MoreStories from "../../more-stories";
import PortableText from "../../portable-text";
import logo from "../../../assets/logo.svg";
import Image from "next/image";

import type {
  PostQueryResult,
  PostSlugsResult,
  SettingsQueryResult,
} from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

type Props = {
  params: { slug: string };
};

const postSlugs = groq`*[_type == "post"]{slug}`;

export async function generateStaticParams() {
  const params = await sanityFetch<PostSlugsResult>({
    query: postSlugs,
    perspective: "published",
    stega: false,
  });
  return params.map(({ slug }) => ({ slug: slug?.current }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await sanityFetch<PostQueryResult>({
    query: postQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.coverImage);

  return {
    authors: post?.author?.name ? [{ name: post?.author?.name }] : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function PostPage({ params }: Props) {
  const [post, settings] = await Promise.all([
    sanityFetch<PostQueryResult>({
      query: postQuery,
      params,
    }),
    sanityFetch<SettingsQueryResult>({
      query: settingsQuery,
    }),
  ]);

  if (!post?._id) {
    return notFound();
  }

  return (
    <>
      <div className=" fixed z-50 bg-white/40 backdrop-blur-lg w-screen py-3">
        <div className="container flex items-center justify-end gap-x-4">
        <h1 className="font-bold text-2xl">Blog</h1>
         
          |
          <Link href="/">
            <Image src={logo} width={86} height={86} alt="logo" />
          </Link>
        </div>
      </div>

      <article className="container pt-28">
        <div className="flex flex-col items-start justify-start">
          <h1 className="mb-12 text-2xl font-bold md:text-4xl lg:text-6xl">
            {post.title}
          </h1>
          <div className="mb-12 hidden md:block">
            {post.author && (
              <Avatar name={post.author.name} picture={post.author.picture} />
            )}
          </div>
        </div>
        <div className="mb-8 sm:mx-0 md:mb-16">
          <CoverImage image={post.coverImage} priority />
        </div>
        <div className=" mx-auto flex flex-col items-start justify-start max-w-2xl">
          <div className="mb-6 block md:hidden">
            {post.author && (
              <Avatar name={post.author.name} picture={post.author.picture} />
            )}
          </div>
          <div className="mb-4 text-md font-bold">
            <DateComponent dateString={post.date} />
          </div>
        </div>
        {post.content?.length && (
          <PortableText
            className="mx-auto max-w-2xl"
            value={post.content as PortableTextBlock[]}
          />
        )}
      </article>
      <aside className="container">
        <hr className="border-accent-2 mb-24 mt-28" />
        <h2 className="mb-8 text-2xl font-bold leading-tight tracking-tighter md:text-4xl">
          اخر المقالات
        </h2>
        <Suspense>
          <MoreStories skip={post._id} limit={2} />
        </Suspense>
      </aside>
    </>
  );
}
