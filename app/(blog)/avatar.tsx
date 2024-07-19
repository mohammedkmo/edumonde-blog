import { Image } from "next-sanity/image";
import type { Author } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";

interface Props {
  name: string;
  picture: Exclude<Author["picture"], undefined> | null;
}

export default function Avatar({ name, picture }: Props) {
  return (
    <div className="flex items-center text-md border border-slate-500/10 bg-white/20 backdrop-blur-lg py-1 pr-1 pl-2 rounded-full">
      {picture?.asset?._ref ? (
        <div className="ml-2 h-6 w-6">
          <Image
            alt={picture?.alt || ""}
            className="h-full rounded-full object-cover"
            height={48}
            width={48}
            src={
              urlForImage(picture)
                ?.height(96)
                .width(96)
                .fit("crop")
                .url() as string
            }
          />
        </div>
      ) : (
        <div className="mr-1 text-black">By </div>
      )}
      <div className="text-pretty text-xs font-bold">{name}</div>
    </div>
  );
}
  