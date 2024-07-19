import Link from "next/link";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";

import type { MoreStoriesQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { moreStoriesQuery } from "@/sanity/lib/queries";

export default async function MoreStories(params: {
  skip: string;
  limit: number;
}) {
  const data = await sanityFetch<MoreStoriesQueryResult>({
    query: moreStoriesQuery,
    params,
  });

  return (
    <>
      <div className="mb-32 grid grid-cols-1 gap-y-20 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:gap-x-32">
        {data?.map((post) => {
          const { _id, title, slug, coverImage, excerpt, author } = post;
          return (
            <article key={_id} className="border rounded-xl p-2">
              <Link
                href={`/posts/${slug}`}
                className="group mb-5 block relative"
              >
                <CoverImage image={coverImage} priority={false} />

                <div className="absolute bg-gradient-to-t from-white to-white/0 w-full h-full left-0 top-0 rounded-xl"></div>
              </Link>
              <div className="px-2">
                <h3 className="text-balance mb-3 text-2xl font-bold leading-snug">
                  <Link href={`/posts/${slug}`} className="hover:underline">
                    {title}
                  </Link>
                </h3>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold">
                    <DateComponent dateString={post.date} />
                  </div>
                  <div className="flex">
                    {excerpt && (
                      <p className="text-pretty mb-4 text-lg leading-relaxed">
                        {excerpt}
                      </p>
                    )}
                    {author && (
                      <Avatar name={author.name} picture={author.picture} />
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
