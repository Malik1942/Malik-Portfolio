import rangerFront from "@/assets/ranger-front.webp";
import rangerDetailPod from "@/assets/ranger-detail-pod.webp";
import rangerDetailGimbal from "@/assets/ranger-detail-gimbal.webp";
import { Chips, PullQuote } from "./MotiModules";
import { noOrphan } from "@/lib/noOrphan";

// RANGER's case-study hook — same shape as ZEAT's and Aura's (highlight chips →
// pull-quote → artifact gallery). The gallery is the skim layer; the sections
// below carry the argument, and the images recur there in context.
const highlights = [
  "Finds ghost gear by camera and sonar",
  "Fires an airbag through the mesh",
  "Floats the net up without a diver",
  "Flies on four vectoring thrusters",
  "Reports every catch to one platform",
];

const artifacts = [
  {
    src: rangerFront,
    alt: "Front elevation of RANGER showing the wide hull, twin side thruster pods, sensor bay, and camera gimbals",
    caption: "The final form: a wide hull between two vectoring thruster pods",
  },
  {
    src: rangerDetailPod,
    alt: "Close-up of the underside sensor bay, showing the ghost net positioning module between two camera pods",
    caption: "The underside, where every sensor that finds a net is mounted",
  },
  {
    src: rangerDetailGimbal,
    alt: "Close-up of a gimballed camera pod mounted beneath the hull",
    caption: "A gimballed camera, because a net has to be seen before it can be caught",
  },
];

function RangerArtifact({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-2xl bg-secondary/10">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-auto block"
        />
      </div>
      <figcaption className="mt-5 md:mt-6 text-base md:text-xl text-foreground text-center leading-relaxed">
        {noOrphan(caption)}
      </figcaption>
    </figure>
  );
}

export function RangerHighlights() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <Chips items={highlights} />
      <PullQuote>
        Today a ghost net comes up because a volunteer dives down and cuts it free.
      </PullQuote>
      <div className="flex flex-col gap-12 md:gap-16">
        {artifacts.map((a) => (
          <RangerArtifact key={a.src} {...a} />
        ))}
      </div>
    </div>
  );
}

export default RangerHighlights;
