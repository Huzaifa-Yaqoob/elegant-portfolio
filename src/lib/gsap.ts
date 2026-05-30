import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP)

export * from "gsap"
export { gsap, ScrollTrigger, useGSAP }
