"use client";

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { generateDefaultContent, VideoEmbedBlockContent } from "@/lib/blocks/blockRegistry";

interface VideoEmbedBlockEditorProps {
  content: Partial<VideoEmbedBlockContent>;
  onChange: (newContent: VideoEmbedBlockContent) => void;
}

export default function VideoEmbedBlockEditor({ content, onChange }: VideoEmbedBlockEditorProps) {
  // Get default content from registry
  const defaultContent = generateDefaultContent("video_embed") as VideoEmbedBlockContent;
  
  const handleChange = (field: keyof VideoEmbedBlockContent, value: any) => {
    onChange({
      ...defaultContent,
      ...content,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4 p-3 border-t mt-2">
      <div>
        <Label htmlFor="video-url">Video URL</Label>
        <Input
          id="video-url"
          type="url"
          value={content.url || ""}
          onChange={(e) => handleChange("url", e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>
      
      <div>
        <Label htmlFor="video-title">Title (Optional)</Label>
        <Input
          id="video-title"
          value={content.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Video title"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="autoplay"
          checked={content.autoplay || false}
          onCheckedChange={(checked) => handleChange("autoplay", checked)}
        />
        <Label htmlFor="autoplay">Autoplay</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="controls"
          checked={content.controls !== false}
          onCheckedChange={(checked) => handleChange("controls", checked)}
        />
        <Label htmlFor="controls">Show Controls</Label>
      </div>
    </div>
  );
}