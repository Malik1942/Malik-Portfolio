import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import AboutDeepContent from "@/components/AboutDeepContent";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background">
      <HeroSection
        isAboutOpen={true}
        onAboutClick={() => {}}
        onAboutBack={() => navigate("/")}
      />
      <AboutDeepContent
        isVisible={true}
        onMainProjectsClick={() => navigate("/")}
      />
    </div>
  );
};

export default About;
