import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { useGSAP } from "@gsap/react"

// Register plugins once here
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP)

// Export everything so you can use it in components
export * from "gsap"
export { gsap, useGSAP }
