import type { CSSProperties } from "react";

import { Media } from "@/components/ui/media";
import { MediaSlideshow } from "@/components/ui/media-slideshow";
import type { Service } from "@/lib/services";

/*
 * A service's photograph, wherever one is shown: the landing page's Services
 * section, the /book picker cards and every wizard step.
 *
 * The one place that decides how a service is pictured — shot once, it is a
 * still; shot more than once (Corporate Wellness, Events Training) the frames
 * cross-fade. Every surface calls this rather than choosing for itself, so a
 * service that gains a second photograph starts sliding everywhere at once.
 *
 * The frame is always the photo's own `imageAspect`, so nothing is cropped;
 * `fallbackAspect` is the mockup geometry for that surface, used for the
 * #D9D9D9 placeholder before a service is chosen or photographed.
 */
export function ServiceMedia({
  service,
  className,
  imageClassName,
  fallbackAspect,
  sizes,
  priority,
}: {
  /** Undefined on a wizard step reached before a service is picked. */
  service?: Service;
  className?: string;
  /** Applied to the photo(s) — for a hover zoom inside the clipped frame. */
  imageClassName?: string;
  /** This surface's mockup geometry, used only when there is no photo. */
  fallbackAspect: string;
  sizes?: string;
  priority?: boolean;
}) {
  const style: CSSProperties = {
    aspectRatio: service?.imageAspect ?? fallbackAspect,
  };
  const alt = service?.name ?? "";

  if (service?.images && service.images.length > 1) {
    return (
      <MediaSlideshow
        images={service.images}
        alt={alt}
        className={className}
        imageClassName={imageClassName}
        sizes={sizes}
        style={style}
      />
    );
  }

  return (
    <Media
      src={service?.image}
      alt={alt}
      className={className}
      imageClassName={imageClassName}
      sizes={sizes}
      priority={priority}
      style={style}
    />
  );
}
