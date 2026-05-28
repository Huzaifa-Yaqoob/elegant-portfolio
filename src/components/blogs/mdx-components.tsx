import type { ReactNode, ReactElement } from "react"

/* ------------------------------------------------------------------ */
/*  CodeBlock                                                          */
/*  Wraps <pre> blocks with a copy button and filename label          */
/* ------------------------------------------------------------------ */
interface CodeBlockProps {
  children?: ReactNode
  filename?: string
  lang?: string
  className?: string
}

export function CodeBlock({
  children,
  filename,
  lang,
  className,
}: CodeBlockProps) {
  const code = extractText(children)

  return (
    <div className="not-prose group/code my-8 w-full overflow-hidden border border-surface-variant bg-surface-container-low">
      {(filename || lang) && (
        <div className="flex items-center justify-between border-b border-surface-variant px-4 py-2">
          {filename && (
            <span className="label-caps-style text-on-surface-variant">
              {filename}
            </span>
          )}
          {lang && (
            <span className="label-caps-style text-outline uppercase">
              {lang}
            </span>
          )}
        </div>
      )}
      <div className="relative overflow-x-auto">
        <button
          onClick={() => code && navigator.clipboard.writeText(code)}
          className="label-caps-style absolute top-2 right-2 border border-surface-variant bg-surface-container-low px-2 py-1 text-outline opacity-0 transition-opacity group-hover/code:opacity-100 hover:bg-surface-container hover:text-on-surface"
          aria-label="Copy code"
        >
          Copy
        </button>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-on-surface">
          <code className={className}>{children}</code>
        </pre>
      </div>
    </div>
  )
}

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number" || typeof node === "boolean") return String(node)
  if (Array.isArray(node)) return node.map(extractText).join("")
  if (node && typeof node === "object" && "props" in node) {
    const el = node as ReactElement<{ children?: ReactNode }>
    return extractText(el.props?.children)
  }
  return ""
}

/* ------------------------------------------------------------------ */
/*  FileTree                                                           */
/*  Renders a project file/directory structure                         */
/* ------------------------------------------------------------------ */
interface FileTreeItem {
  name: string
  type: "file" | "directory"
  children?: FileTreeItem[]
}

interface FileTreeProps {
  structure: FileTreeItem[]
  className?: string
}

export function FileTree({ structure, className }: FileTreeProps) {
  return (
    <div
      className={`not-prose my-8 w-full border border-surface-variant bg-surface-container-low p-4 ${className ?? ""}`}
    >
      <div className="mb-3 flex items-center gap-2 border-b border-surface-variant pb-2">
        <span className="size-2.5 rounded-full bg-destructive" />
        <span className="size-2.5 rounded-full bg-[#f5c542]" />
        <span className="size-2.5 rounded-full bg-[#4ac74a]" />
        <span className="label-caps-style ml-2 text-outline">Explorer</span>
      </div>
      <div className="space-y-1">
        {structure.map((item, i) => (
          <FileTreeNode key={i} item={item} depth={0} />
        ))}
      </div>
    </div>
  )
}

function FileTreeNode({ item, depth }: { item: FileTreeItem; depth: number }) {
  const indent = depth * 20

  return (
    <div>
      <div
        className="flex items-center gap-2 py-0.5 text-sm hover:bg-surface-container-high/50"
        style={{ paddingLeft: `${12 + indent}px` }}
      >
        {item.type === "directory" ? <FolderIcon /> : <FileIcon />}
        <span className="text-on-surface">{item.name}</span>
      </div>
      {item.children?.map((child, i) => (
        <FileTreeNode key={i} item={child} depth={depth + 1} />
      ))}
    </div>
  )
}

function FolderIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 text-outline"
    >
      <path
        d="M2 4.5C2 3.67157 2.67157 3 3.5 3H6.5C6.77614 3 7 3.22386 7 3.5C7 3.77614 7.22386 4 7.5 4H12.5C13.3284 4 14 4.67157 14 5.5V11.5C14 12.3284 13.3284 13 12.5 13H3.5C2.67157 13 2 12.3284 2 11.5V4.5Z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 text-outline"
    >
      <path
        d="M3.5 2H9.5C9.77614 2 10 2.22386 10 2.5V5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 6.22386 14 6.5V13.5C14 14.3284 13.3284 15 12.5 15H3.5C2.67157 15 2 14.3284 2 13.5V3.5C2 2.67157 2.67157 2 3.5 2Z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M10 2.5V5.5C10 5.77614 10.2239 6 10.5 6H13.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  BlogTable                                                          */
/*  Styled table component with caption                                */
/* ------------------------------------------------------------------ */
interface BlogTableProps {
  headers: string[]
  rows: string[][]
  caption?: string
  className?: string
}

export function BlogTable({
  headers,
  rows,
  caption,
  className,
}: BlogTableProps) {
  return (
    <div
      className={`not-prose my-8 w-full overflow-x-auto border border-surface-variant ${className ?? ""}`}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-surface-variant bg-surface-container-low">
            {headers.map((h, i) => (
              <th
                key={i}
                className="label-caps-style border-r border-surface-variant px-4 py-3 text-left text-on-surface last:border-r-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-surface-variant last:border-b-0 hover:bg-surface-container-low/50"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="border-r border-surface-variant px-4 py-3 text-sm text-on-surface-variant last:border-r-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <div className="border-t border-surface-variant px-4 py-2">
          <span className="label-data-style text-outline italic">
            {caption}
          </span>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  BlogImage                                                          */
/*  Image with optional caption, styled for zero-radius design         */
/* ------------------------------------------------------------------ */
interface BlogImageProps {
  src: string
  alt: string
  caption?: string
  className?: string
}

export function BlogImage({ src, alt, caption, className }: BlogImageProps) {
  return (
    <figure
      className={`not-prose my-8 w-full border border-surface-variant ${className ?? ""}`}
    >
      <div className="bg-surface-container-low">
        <img
          src={src}
          alt={alt}
          className="h-auto w-full object-cover"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="border-t border-surface-variant px-4 py-3">
          <span className="label-data-style text-outline italic">
            {caption}
          </span>
        </figcaption>
      )}
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/*  HTML overrides for MDX rendering — used via components prop       */
/* ------------------------------------------------------------------ */
/* eslint-disable-next-line react-refresh/only-export-components */
export function preOverride(props: { children?: ReactNode; title?: string }) {
  const children = props.children
  const langMatch =
    children != null && typeof children === "object" && "props" in children
      ? (
          (children as ReactElement<{ className?: string }>).props
            ?.className as string | undefined
        )?.match(/language-(\w+)/)
      : undefined
  const lang = langMatch?.[1]

  return (
    <CodeBlock lang={lang} filename={props.title}>
      {props.children}
    </CodeBlock>
  )
}

/* eslint-disable-next-line react-refresh/only-export-components */
export function tableOverride(props: { children?: ReactNode }) {
  return (
    <div className="not-prose my-8 w-full overflow-x-auto border border-surface-variant">
      <table className="w-full border-collapse">{props.children}</table>
    </div>
  )
}

/* eslint-disable-next-line react-refresh/only-export-components */
export function imgOverride(props: {
  src?: string
  alt?: string
  title?: string
}) {
  return (
    <BlogImage
      src={props.src ?? ""}
      alt={props.alt ?? ""}
      caption={props.title}
    />
  )
}
