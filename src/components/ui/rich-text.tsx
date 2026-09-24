"use client";

import { AlignCenter, AlignLeft, AlignRight, Bold, Highlighter, IndentDecrease, IndentIncrease, Italic, Link2, List, ListOrdered, Minus, Palette, Redo2, RemoveFormatting, Strikethrough, Type, Underline, Undo2 } from "lucide-react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { CSSProperties, ReactNode } from "react";

const htmlPattern = /<\/?[a-z][\s\S]*>/i;
const subscribeToClient = () => () => {};
const safeColor = /^(#[0-9a-f]{3,8}|(?:rgb|hsl)a?\([\d\s,%.]+\)|[a-z]+)$/i;

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function allowedColor(value: string) {
  return safeColor.test(value.trim()) ? value.trim() : "";
}

function allowedUrl(value: string) {
  try {
    const url = new URL(value, window.location.origin);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function styleAttribute(element: HTMLElement) {
  const styles: string[] = [];
  if (["left", "center", "right", "justify"].includes(element.style.textAlign)) styles.push(`text-align:${element.style.textAlign}`);
  const color = allowedColor(element.style.color);
  const background = allowedColor(element.style.backgroundColor);
  if (color) styles.push(`color:${color}`);
  if (background) styles.push(`background-color:${background}`);
  return styles.length ? ` style="${styles.join(";")}"` : "";
}

function serialiseNodes(nodes: NodeListOf<ChildNode> | ChildNode[]): string {
  return Array.from(nodes).map((node) => {
    if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent ?? "");
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const element = node as HTMLElement;
    const tag = element.tagName.toLowerCase();
    const children = serialiseNodes(element.childNodes);
    if (["br", "hr"].includes(tag)) return `<${tag}>`;
    if (["p", "h1", "h2", "h3", "blockquote", "ul", "ol", "li", "strong", "b", "em", "i", "u", "s", "strike", "mark"].includes(tag)) return `<${tag}${styleAttribute(element)}>${children}</${tag}>`;
    if (tag === "div") return `<p${styleAttribute(element)}>${children}</p>`;
    if (tag === "font") return `<span${styleAttribute(element)}>${children}</span>`;
    if (tag === "span") return element.style.backgroundColor ? `<mark${styleAttribute(element)}>${children}</mark>` : `<span${styleAttribute(element)}>${children}</span>`;
    if (tag === "a") {
      const href = allowedUrl(element.getAttribute("href") ?? "");
      return href ? `<a href="${escapeHtml(href)}">${children}</a>` : children;
    }
    return children;
  }).join("");
}

export function sanitiseRichText(value: string) {
  if (typeof window === "undefined") return value;
  if (!htmlPattern.test(value)) return escapeHtml(value).replace(/\n/g, "<br>");
  const parsed = new DOMParser().parseFromString(value, "text/html");
  return serialiseNodes(parsed.body.childNodes);
}

function plainText(value: string) {
  if (typeof window === "undefined") return value.replace(/<[^>]*>/g, "");
  const parsed = new DOMParser().parseFromString(sanitiseRichText(value), "text/html");
  return parsed.body.textContent ?? "";
}

export function RichTextEditor({ name, onChange, placeholder, value }: { name: string; onChange: (value: string) => void; placeholder: string; value: string }) {
  const editor = useRef<HTMLDivElement>(null);
  const selection = useRef<Range | null>(null);
  const initialContent = sanitiseRichText(value);

  useEffect(() => {
    if (editor.current && editor.current.innerHTML !== initialContent) editor.current.innerHTML = initialContent;
  }, [initialContent]);

  function rememberSelection() {
    const activeSelection = window.getSelection();
    if (activeSelection?.rangeCount) selection.current = activeSelection.getRangeAt(0).cloneRange();
  }

  function restoreSelection() {
    if (!selection.current) return;
    const activeSelection = window.getSelection();
    activeSelection?.removeAllRanges();
    activeSelection?.addRange(selection.current);
  }

  function syncValue() {
    if (editor.current) onChange(sanitiseRichText(editor.current.innerHTML));
  }

  function run(command: string, commandValue?: string) {
    editor.current?.focus();
    restoreSelection();
    document.execCommand(command, false, commandValue);
    syncValue();
  }

  function addLink() {
    const url = window.prompt("Paste a web address (https://...) or email address (mailto:...)");
    if (url?.trim()) run("createLink", url.trim());
  }

  return <section className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
    <input name={name} readOnly type="hidden" value={value} />
    <div aria-label="Document formatting tools" className="flex flex-wrap items-center gap-x-1 gap-y-2 border-b border-slate-200 bg-slate-50 p-2" onMouseDown={rememberSelection} role="toolbar">
      <div className="flex items-center gap-1 border-r border-slate-200 pr-2"><select aria-label="Text style" className="h-8 rounded border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500" defaultValue="p" onChange={(event) => run("formatBlock", event.target.value)}><option value="p">Normal text</option><option value="h1">Title</option><option value="h2">Heading</option><option value="h3">Subheading</option><option value="blockquote">Quote</option></select></div>
      <ToolbarGroup><ToolButton label="Undo" onClick={() => run("undo")}><Undo2 className="size-4" /></ToolButton><ToolButton label="Redo" onClick={() => run("redo")}><Redo2 className="size-4" /></ToolButton></ToolbarGroup>
      <ToolbarGroup><ToolButton label="Bold (Ctrl+B)" onClick={() => run("bold")}><Bold className="size-4" /></ToolButton><ToolButton label="Italic (Ctrl+I)" onClick={() => run("italic")}><Italic className="size-4" /></ToolButton><ToolButton label="Underline (Ctrl+U)" onClick={() => run("underline")}><Underline className="size-4" /></ToolButton><ToolButton label="Strikethrough" onClick={() => run("strikeThrough")}><Strikethrough className="size-4" /></ToolButton></ToolbarGroup>
      <ToolbarGroup><ColorButton icon={<Palette className="size-4" />} label="Text colour" onChange={(color) => run("foreColor", color)} value="#1e293b" /><ColorButton icon={<Highlighter className="size-4" />} label="Highlight colour" onChange={(color) => run("hiliteColor", color)} value="#fef08a" /></ToolbarGroup>
      <ToolbarGroup><ToolButton label="Bulleted list" onClick={() => run("insertUnorderedList")}><List className="size-4" /></ToolButton><ToolButton label="Numbered list" onClick={() => run("insertOrderedList")}><ListOrdered className="size-4" /></ToolButton><ToolButton label="Decrease indent" onClick={() => run("outdent")}><IndentDecrease className="size-4" /></ToolButton><ToolButton label="Increase indent" onClick={() => run("indent")}><IndentIncrease className="size-4" /></ToolButton></ToolbarGroup>
      <ToolbarGroup><ToolButton label="Align left" onClick={() => run("justifyLeft")}><AlignLeft className="size-4" /></ToolButton><ToolButton label="Align centre" onClick={() => run("justifyCenter")}><AlignCenter className="size-4" /></ToolButton><ToolButton label="Align right" onClick={() => run("justifyRight")}><AlignRight className="size-4" /></ToolButton></ToolbarGroup>
      <ToolbarGroup><ToolButton label="Add link (Ctrl+K)" onClick={addLink}><Link2 className="size-4" /></ToolButton><ToolButton label="Remove link" onClick={() => run("unlink")}><Link2 className="size-4 text-slate-400" /></ToolButton><ToolButton label="Horizontal line" onClick={() => run("insertHorizontalRule")}><Minus className="size-4" /></ToolButton><ToolButton label="Clear formatting" onClick={() => run("removeFormat")}><RemoveFormatting className="size-4" /></ToolButton></ToolbarGroup>
    </div>
    <div className="relative bg-slate-100 p-3 sm:p-5">
      <div className="relative mx-auto min-h-72 max-w-3xl bg-white px-5 py-6 shadow-sm sm:px-9 sm:py-8">
        {!plainText(value) && <span className="pointer-events-none absolute left-5 top-6 whitespace-pre-line text-base leading-7 text-slate-400 sm:left-9 sm:top-8">{placeholder}</span>}
        <div aria-label="Meal plan document" className="min-h-56 text-base leading-7 text-slate-800 outline-none [&_a]:text-blue-700 [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-300 [&_blockquote]:pl-3 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_hr]:my-4 [&_mark]:rounded-sm [&_mark]:px-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6" contentEditable onInput={syncValue} onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); addLink(); } }} onPaste={(event) => { event.preventDefault(); document.execCommand("insertText", false, event.clipboardData.getData("text/plain")); syncValue(); }} ref={editor} role="textbox" suppressContentEditableWarning tabIndex={0} />
      </div>
    </div>
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-3 py-2 text-xs text-slate-500"><span><Type className="mr-1 inline size-3.5" />Document editor</span><span>{plainText(value).length.toLocaleString()} characters</span></div>
  </section>;
}

function ToolbarGroup({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-1 border-r border-slate-200 pr-2 last:border-r-0">{children}</div>;
}

function ToolButton({ children, label, onClick }: { children: ReactNode; label: string; onClick: () => void }) {
  return <button aria-label={label} className="flex size-8 items-center justify-center rounded text-slate-600 hover:bg-white hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" onMouseDown={(event) => event.preventDefault()} onClick={onClick} title={label} type="button">{children}</button>;
}

function ColorButton({ icon, label, onChange, value }: { icon: ReactNode; label: string; onChange: (color: string) => void; value: string }) {
  return <label aria-label={label} className="relative flex size-8 cursor-pointer items-center justify-center rounded text-slate-600 hover:bg-white hover:text-emerald-700" title={label}>{icon}<input aria-label={label} className="absolute inset-0 cursor-pointer opacity-0" defaultValue={value} onChange={(event) => onChange(event.target.value)} type="color" /></label>;
}

export function FormattedRichText({ value }: { value: string }) {
  const isClient = useSyncExternalStore(subscribeToClient, () => true, () => false);
  if (!isClient) return <p className="whitespace-pre-wrap">{value}</p>;
  const safeHtml = sanitiseRichText(value);
  const parsed = new DOMParser().parseFromString(safeHtml, "text/html");
  return <div className="text-sm leading-6 text-slate-700 [&_a]:text-blue-700 [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-300 [&_blockquote]:pl-3 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:font-semibold [&_hr]:my-4 [&_mark]:rounded-sm [&_mark]:px-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5">{renderNodes(parsed.body.childNodes)}</div>;
}

function elementStyle(element: HTMLElement): CSSProperties {
  const style: CSSProperties = {};
  if (["left", "center", "right", "justify"].includes(element.style.textAlign)) style.textAlign = element.style.textAlign as CSSProperties["textAlign"];
  const color = allowedColor(element.style.color);
  const backgroundColor = allowedColor(element.style.backgroundColor);
  if (color) style.color = color;
  if (backgroundColor) style.backgroundColor = backgroundColor;
  return style;
}

function renderNodes(nodes: NodeListOf<ChildNode> | ChildNode[]): ReactNode[] {
  return Array.from(nodes).map((node, index) => {
    const key = `${node.nodeName}-${index}`;
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const element = node as HTMLElement;
    const children = renderNodes(element.childNodes);
    const style = elementStyle(element);
    switch (element.tagName.toLowerCase()) {
      case "br": return <br key={key} />;
      case "hr": return <hr key={key} />;
      case "p": return <p key={key} style={style}>{children}</p>;
      case "h1": return <h1 key={key} style={style}>{children}</h1>;
      case "h2": return <h2 key={key} style={style}>{children}</h2>;
      case "h3": return <h3 key={key} style={style}>{children}</h3>;
      case "blockquote": return <blockquote key={key} style={style}>{children}</blockquote>;
      case "ul": return <ul key={key} style={style}>{children}</ul>;
      case "ol": return <ol key={key} style={style}>{children}</ol>;
      case "li": return <li key={key} style={style}>{children}</li>;
      case "strong": case "b": return <strong key={key} style={style}>{children}</strong>;
      case "em": case "i": return <em key={key} style={style}>{children}</em>;
      case "u": return <u key={key} style={style}>{children}</u>;
      case "s": case "strike": return <s key={key} style={style}>{children}</s>;
      case "mark": return <mark key={key} style={style}>{children}</mark>;
      case "a": return <a href={allowedUrl(element.getAttribute("href") ?? "") || undefined} key={key} rel="noreferrer" style={style} target="_blank">{children}</a>;
      default: return <span key={key} style={style}>{children}</span>;
    }
  });
}
