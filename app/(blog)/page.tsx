import Link from "next/link";
import { Suspense } from "react";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";
import MoreStories from "./more-stories";
import Onboarding from "./onboarding";
import PortableText from "./portable-text";

import type { HeroQueryResult, SettingsQueryResult } from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { heroQuery, settingsQuery } from "@/sanity/lib/queries";
import logo from "../assets/logo.svg";
import Image from "next/image";

function Intro() {
  return (
    <section className="mt-16 mb-16 flex items-center lg:mb-12 justify-between">
      <h1 className="text-pretty mt-5 text-center font-bold text-2xl lg:pl-8 lg:text-left">
      Blog 
      </h1>
      <Image src={logo} width={100} height={100} alt="logo" />
    </section>
  );
}

function HeroPost({
  title,
  slug,
  excerpt,
  coverImage,
  date,
  author,
}: Pick<
  Exclude<HeroQueryResult, null>,
  "title" | "coverImage" | "date" | "excerpt" | "author" | "slug"
>) {
  return (
    <article>
      <div className="group mb-8 md:mb-16 relative">
        <CoverImage image={coverImage} priority />

        <div className="w-full h-full bg-gradient-to-t from-black/70 to-black/20 absolute top-0 right-0 left-0 rounded-xl"></div>

        <div className=" absolute bottom-4 right-4 left-4 md:left-8 md:bottom-8 md:right-8  text-white">
          <h3 className="text-pretty text-2xl lg:text-5xl font-bold mb-4 md:mb-6">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="text-sm flex justify-between items-start md:items-center">
            <DateComponent dateString={date} />
            <div className="">
              {excerpt && (
                <p className="text-pretty text-sm leading-relaxed">{excerpt}</p>
              )}
              {author && <Avatar name={author.name} picture={author.picture} />}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function Page() {
  const [settings, heroPost] = await Promise.all([
    sanityFetch<SettingsQueryResult>({
      query: settingsQuery,
    }),
    sanityFetch<HeroQueryResult>({ query: heroQuery }),
  ]);

  return (
    <div className="container mx-auto px-5">
      <Intro />
      {heroPost ? (
        <HeroPost
          title={heroPost.title}
          slug={heroPost.slug}
          coverImage={heroPost.coverImage}
          excerpt={heroPost.excerpt}
          date={heroPost.date}
          author={heroPost.author}
        />
      ) : (
        <Onboarding />
      )}
      {heroPost?._id && (
        <aside>
          <h2 className="mb-8 text-2xl font-bold md:text-4xl">
            المزيد من المقالات
          </h2>
          <Suspense>
            <MoreStories skip={heroPost._id} limit={100} />
          </Suspense>
        </aside>
      )}
    </div>
  );
}
