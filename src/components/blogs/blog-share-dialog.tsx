import { useState } from "react"
import { Check, Copy, Share2 } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface BlogShareDialogProps {
  url: string
  title: string
}

const platforms = [
  {
    name: "X",
    shareUrl: (u: string, t: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
    icon: XIcon,
  },
  {
    name: "Facebook",
    shareUrl: (u: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    icon: FacebookIcon,
  },
  {
    name: "LinkedIn",
    shareUrl: (u: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
    icon: LinkedInIcon,
  },
  {
    name: "WhatsApp",
    shareUrl: (u: string, t: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
    icon: WhatsAppIcon,
  },
]

export default function BlogShareDialog({ url, title }: BlogShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      return
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger
        className="inline-flex items-center gap-2 border border-surface-variant px-3 py-1.5 text-sm text-outline transition-colors hover:border-outline hover:text-on-surface"
        aria-label="Share this article"
      >
        <Share2 size={14} />
        <span className="label-caps-style">Share</span>
      </DialogTrigger>
      <DialogContent className="border border-surface-variant bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">Share this article</DialogTitle>
          <DialogDescription>
            Share "{title}" with your network
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 border border-surface-variant px-3 py-2">
          <input
            type="text"
            value={url}
            readOnly
            className="min-w-0 flex-1 bg-transparent text-sm text-on-surface outline-none"
          />
          <button
            onClick={handleCopy}
            className="label-caps-style inline-flex items-center gap-1.5 border border-surface-variant px-2.5 py-1 text-outline transition-colors hover:border-outline hover:text-on-surface"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="label-caps-style text-outline">Share on</span>
          <div className="flex items-center gap-2">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.shareUrl(url, title)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center border border-surface-variant text-outline transition-colors hover:border-outline hover:text-on-surface"
                aria-label={`Share on ${p.name}`}
              >
                <p.icon />
              </a>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function XIcon() {
  return (
    <svg fill="none" viewBox="0 0 1200 1227" className="size-4">
      <path
        fill="currentColor"
        d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4">
      <path
        fill="currentColor"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 256 256"
      className="size-4"
      preserveAspectRatio="xMidYMid"
    >
      <path
        d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"
        fill="currentColor"
      />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg fill="none" viewBox="0 0 360 362" className="size-4">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M307.546 52.566C273.709 18.684 228.706.017 180.756 0 81.951 0 1.538 80.404 1.504 179.235c-.017 31.594 8.242 62.432 23.928 89.609L0 361.736l95.024-24.925c26.179 14.285 55.659 21.805 85.655 21.814h.077c98.788 0 179.21-80.413 179.244-179.244.017-47.898-18.608-92.926-52.454-126.807v-.008Zm-126.79 275.788h-.06c-26.73-.008-52.952-7.194-75.831-20.765l-5.44-3.231-56.391 14.791 15.05-54.981-3.542-5.638c-14.912-23.721-22.793-51.139-22.776-79.286.035-82.14 66.867-148.973 149.051-148.973 39.793.017 77.198 15.53 105.328 43.695 28.131 28.157 43.61 65.596 43.593 105.398-.035 82.149-66.867 148.982-148.982 148.982v.008Zm81.719-111.577c-4.478-2.243-26.497-13.073-30.606-14.568-4.108-1.496-7.09-2.243-10.073 2.243-2.982 4.487-11.568 14.577-14.181 17.559-2.613 2.991-5.226 3.361-9.704 1.117-4.477-2.243-18.908-6.97-36.02-22.226-13.313-11.878-22.304-26.54-24.916-31.027-2.613-4.486-.275-6.91 1.959-9.136 2.011-2.011 4.478-5.234 6.721-7.847 2.244-2.613 2.983-4.486 4.478-7.469 1.496-2.991.748-5.603-.369-7.847-1.118-2.243-10.073-24.289-13.812-33.253-3.636-8.732-7.331-7.546-10.073-7.692-2.613-.13-5.595-.155-8.586-.155-2.991 0-7.839 1.118-11.947 5.604-4.108 4.486-15.677 15.324-15.677 37.361s16.047 43.344 18.29 46.335c2.243 2.991 31.585 48.225 76.51 67.632 10.684 4.615 19.029 7.374 25.535 9.437 10.727 3.412 20.49 2.931 28.208 1.779 8.604-1.289 26.498-10.838 30.228-21.298 3.73-10.46 3.73-19.433 2.613-21.298-1.117-1.865-4.108-2.991-8.586-5.234l.008-.017Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
