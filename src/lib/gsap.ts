import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register plugins once here
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Export everything so you can use it in components
export * from "gsap";
export { gsap };