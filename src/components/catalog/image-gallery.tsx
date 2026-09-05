import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Kit } from "@/lib/types";
import { KitThumbnail } from "./kit-thumbnail";

export function ImageGallery({ kit }: { kit: Kit }) {
  const slides = kit.images.length ? kit.images : [""];
  const [index, setIndex] = useState(0);
  const current = slides[index] ?? "";

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${kit.id}-${index}`}
            initial={{ opacity: 0.4, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <KitThumbnail
              kit={kit}
              src={current || undefined}
              variant="gallery"
              className="aspect-[16/11]"
            />
          </motion.div>
        </AnimatePresence>
        {slides.length > 1 ? (
          <>
            <Button
              size="sm"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full"
              onClick={() =>
                setIndex((value) => (value - 1 + slides.length) % slides.length)
              }
              aria-label="Previous image"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              size="sm"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full"
              onClick={() => setIndex((value) => (value + 1) % slides.length)}
              aria-label="Next image"
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        ) : null}
      </div>
      {slides.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto">
          {slides.map((src, slideIndex) => (
            <button
              key={`${src}-${slideIndex}`}
              type="button"
              onClick={() => setIndex(slideIndex)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border ${
                slideIndex === index
                  ? "border-cyan-300"
                  : "border-white/10 opacity-70 hover:opacity-100"
              }`}
            >
              <KitThumbnail
                kit={kit}
                src={src || undefined}
                variant="thumb"
                className="size-full"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
