import { useSeo } from "../lib/seo";
import { Hero } from "../components/sections/Hero";
import { TrustStrip } from "../components/sections/TrustStrip";
import { AboutPreview } from "../components/sections/AboutPreview";
import { Capabilities } from "../components/sections/Capabilities";
import { Industries } from "../components/sections/Industries";
import { ProcessTimeline } from "../components/sections/ProcessTimeline";
import { SafetyCompliance } from "../components/sections/SafetyCompliance";
import { WhyUs } from "../components/sections/WhyUs";
import { EnterpriseCta } from "../components/sections/EnterpriseCta";
import { FinalCta } from "../components/sections/FinalCta";

export function Home() {
  useSeo({
    title: "Industrial Workforce & Manpower Solutions",
    description:
      "Vishal Enterprises provides skilled, semi-skilled and unskilled industrial workforce and manpower solutions for manufacturing, engineering, EPC, infrastructure and construction organizations.",
  });

  return (
    <>
      <Hero />
      <TrustStrip />
      <AboutPreview />
      <Capabilities />
      <Industries />
      <ProcessTimeline />
      <SafetyCompliance />
      <WhyUs />
      <EnterpriseCta />
      <FinalCta />
    </>
  );
}
