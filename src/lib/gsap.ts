import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"

// Register plugins once here — single registration point for the entire project
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, useGSAP)

// Export everything so you can use it in components
export * from "gsap"
export { gsap, ScrollTrigger, SplitText, useGSAP }
