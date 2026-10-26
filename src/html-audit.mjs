#!/usr/bin/env node
/* Audit rapide de pages HTML : balises indispensables au référencement et à l'accessibilité de base. */
import { readFileSync } from 'node:fs'
import { walkFiles } from '../lib/walk.mjs'
import { isMain, parseArgs, usage, fail } from '../lib/cli.mjs'

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'))?.slice(2).find((v) => v !== undefined)

export function auditHtml(html) {
  const issues = []
  const text = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '')
  const htmlTag = text.match(/<html\b[^>]*>/i)?.[0] ?? ''
  if (!attr(htmlTag, 'lang')) issues.push('balise <html> sans attribut lang')
  const title = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim()
  if (!title) issues.push('<title> absent ou vide'); else if (title.length > 65) issues.push(`<title> trop long (${title.length} caractères, ~60 conseillés)`)
  const metas = [...text.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0])
  const desc = metas.find((m) => attr(m, 'name')?.toLowerCase() === 'description')
  if (!desc || !attr(desc, 'content')?.trim()) issues.push('meta description absente ou vide')
  if (!metas.some((m) => attr(m, 'name')?.toLowerCase() === 'viewport')) issues.push('meta viewport absente')
  const h1 = (text.match(/<h1\b/gi) ?? []).length
  if (h1 !== 1) issues.push(`${h1} balise(s) <h1> (une seule attendue)`)
  for (const img of text.match(/<img\b[^>]*>/gi) ?? []) if (attr(img, 'alt') === undefined) issues.push(`image sans attribut alt : ${(attr(img, 'src') ?? '?').slice(0, 60)}`)
  for (const a of text.match(/<a\b[^>]*>/gi) ?? []) {
    const href = attr(a, 'href')
    if (href === undefined || href.trim() === '' || href.trim() === '#') issues.push('lien sans destination (href vide ou « # »)')
    if (attr(a, 'target') === '_blank' && !/noopener|noreferrer/i.test(attr(a, 'rel') ?? '')) issues.push(`lien target=_blank sans rel="noopener" : ${(href ?? '').slice(0, 60)}`)
  }
  return issues
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2), ['help'])
  usage(`
Usage : node src/html-audit.mjs dossier-ou-fichier.html
Contrôle : lang, title, meta description, viewport, un seul h1, alt des images, liens vides, target=_blank.
Code de sortie 2 s'il y a au moins un problème.`, args, 1)
  let files
  try { files = args._.flatMap((p) => (/\.html?$/i.test(p) ? [{ path: p }] : walkFiles(p, { filter: (f) => /\.html?$/i.test(f) }))) } catch (e) { fail(e.message) }
  let total = 0
  for (const f of files) {
    const issues = auditHtml(readFileSync(f.path, 'utf8'))
    total += issues.length
    console.log(`${issues.length ? '✗' : '✓'} ${f.path}`)
    issues.forEach((i) => console.log(`    - ${i}`))
  }
  console.log(`\n${files.length} page(s), ${total} problème(s).`)
  process.exit(total ? 2 : 0)
}
