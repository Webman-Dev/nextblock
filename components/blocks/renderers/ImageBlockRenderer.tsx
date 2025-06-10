import React from "react";
import Image from "next/image";
import type { ImageBlockContent } from "@/utils/supabase/types";

const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_BASE_URL || "";

interface ImageBlockRendererProps {
  content: ImageBlockContent;
  languageId: number;
}

const ImageBlockRenderer: React.FC<ImageBlockRendererProps> = ({
  content,
  languageId,
}) => {
  if (!content.media_id || !content.object_key) {
    return (
      <div className="my-4 p-4 border rounded text-center text-muted-foreground italic">
        (Image block: Media not selected or object_key missing)
      </div>
    );
  }
  
  if (
    typeof content.width !== "number" ||
    typeof content.height !== "number" ||
    content.width <= 0 ||
    content.height <= 0
  ) {
    return (
      <div className="my-4 p-4 border rounded text-center text-muted-foreground italic">
        (Image block: Image dimensions are missing or invalid)
      </div>
    );
  }

  const displayImageUrl = `${R2_BASE_URL}/${content.object_key}`;
  
  return (
    <div className="w-full">
      <figure
        className="my-6 text-center mx-auto max-w-full"
        // Removed inline style: style={{ width: content.width }}
      >
        <Image
          src={displayImageUrl}
          alt={content.alt_text || "Uploaded image"}
          width={content.width}
          height={content.height}
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
          className="rounded-md border"
          placeholder={content.blur_data_url ? "blur" : "empty"}
          blurDataURL={content.blur_data_url || undefined}
        />
        {content.caption && (
          <figcaption className="text-sm text-muted-foreground mt-2">
            {content.caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
};

export default ImageBlockRenderer;