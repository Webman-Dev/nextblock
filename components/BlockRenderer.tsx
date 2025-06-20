// components/BlockRenderer.tsx
import React from "react";
import dynamic from "next/dynamic";
import type { Database } from "@/utils/supabase/types";
import { getBlockDefinition, type SectionBlockContent } from "@/lib/blocks/blockRegistry";

type Block = Database['public']['Tables']['blocks']['Row'];
import HeroBlockRenderer from "./blocks/renderers/HeroBlockRenderer"; // Static import for LCP

interface BlockRendererProps {
  blocks: Block[];
  languageId: number;
}

interface DynamicBlockRendererProps {
  block: Block;
  languageId: number;
}

// Dynamic renderer component that handles the dynamic import logic for non-LCP blocks
const DynamicBlockRenderer: React.FC<DynamicBlockRendererProps> = ({
  block,
  languageId,
}) => {
  const blockDefinition = getBlockDefinition(block.block_type as any);
  
  if (!blockDefinition) {
    return (
      <div
        key={block.id}
        className="my-4 p-4 border rounded bg-destructive/10 text-destructive"
      >
        <p>
          <strong>Unsupported block type:</strong> {block.block_type}
        </p>
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(block.content, null, 2)}
        </pre>
      </div>
    );
  }

  // Create dynamic component with proper SSR handling
  const RendererComponent = dynamic(
    () => import(`./blocks/renderers/${blockDefinition.rendererComponentFilename}`),
    {
      loading: () => (
        <div className="my-4 p-4 border rounded bg-muted animate-pulse">
          <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
        </div>
      ),
      ssr: true,
    }
  ) as React.ComponentType<any>;

  // Handle different prop requirements for different renderers
  // PostsGridBlockRenderer needs the full block object
  if (block.block_type === 'posts_grid') {
    return (
      <RendererComponent
        content={block.content}
        languageId={languageId}
        block={block}
      />
    );
  }

  return (
    <RendererComponent
      content={block.content}
      languageId={languageId}
    />
  );
};

const BlockRenderer: React.FC<BlockRendererProps> = ({
  blocks,
  languageId,
}) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block) => {
        // Statically render the Hero block for LCP optimization
        if (block.block_type === 'hero') {
          return (
            <HeroBlockRenderer
              key={block.id}
              content={block.content as unknown as SectionBlockContent}
              languageId={languageId}
            />
          );
        }
        // Dynamically render all other blocks
        return (
          <DynamicBlockRenderer
            key={block.id}
            block={block}
            languageId={languageId}
          />
        );
      })}
    </>
  );
};

export default BlockRenderer;
