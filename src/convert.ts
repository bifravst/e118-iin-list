import csv from 'csv-parser'
import * as fs from 'fs'
import * as path from 'path'
import prettier from 'prettier'
import { darkIssuersList } from './darkIssuers.js'
import type { IssuerList } from './types.js'

type ParsedCSVEntry = {
	CountryGeographicalarea: string
	CompanyNameAddress: string
	IssuerIdentifierNumber: string
	Contact: string
}

const results: ParsedCSVEntry[] = []

const target = path.join(process.cwd(), 'src', 'list.ts')

const notBlank = (s: string) => (s.trim().length > 0 ? s.trim() : undefined)
const removeBlanks = (o: Record<string, string | undefined>) => {
	const result: Record<string, string> = {}
	for (const [k, v] of Object.entries(o)) {
		if (v !== undefined) {
			result[k] = v
		}
	}
	return result
}

await new Promise<void>((resolve) =>
	fs
		.createReadStream('list.csv')
		.pipe(csv())
		.on('data', (data) => results.push(data))
		.on('end', () => resolve()),
)
type Issuers = Record<
	string,
	{
		company: string
		country?: string
		contact: string[]
	}
>
const issuerData: Issuers = {}

let currentICCID: string | undefined
for (const [country, company, iccid, contact] of results.map((r) =>
	Object.values(r),
)) {
	if (iccid.startsWith('89')) {
		currentICCID = notBlank(iccid)
	}
	if (currentICCID === undefined) continue
	const current = issuerData[currentICCID] ?? {}
	issuerData[currentICCID] = {
		...current,
		...removeBlanks({
			country: notBlank(country),
			company: notBlank(current.company ?? company),
		}),
		contact: [...(current.contact ?? []), notBlank(contact)].filter(
			(s) => s !== undefined,
		),
	}
}

const list: IssuerList = Object.entries(issuerData).reduce<IssuerList>(
	(list, [iccid, { company, country, contact }]) => {
		const [, countryCode, issuerIdentifierNumber] = iccid.split(' ')
		const iin = parseInt(iccid.replace(/ /g, ''), 10)
		const key = `${countryCode}${issuerIdentifierNumber}`
		const emailRegEx = /e-mail ?: ?(.+)/i
		const companyURLs = contact.reduce(
			(urls, s) => {
				const m = emailRegEx.exec(s)
				if (!m) return urls
				return m[1]
					.replace(/ /g, '')
					.split(';')
					.map((email) => email.replace(/^.+@/, 'http://').toLowerCase())
					.filter((url, k, urls) => urls.indexOf(url) === k)
			},
			undefined as undefined | string[],
		)
		const cc = parseInt(countryCode, 10)
		const result = {
			...list,
			[key]: [
				iin,
				issuerIdentifierNumber,
				cc,
				[881, 882, 883].includes(cc) ? 'Global' : country,
				company,
				companyURLs ?? [],
			],
		}
		if (cc === 1) {
			// USA: Some vendors prefix the 1 with a 0 in the ICCID
			result[`0${key}`] = result[key]
		}
		return result as IssuerList
	},
	darkIssuersList,
)

fs.writeFileSync(
	target,
	await prettier.format(
		[
			`/* Auto-generated file. Do not change! */`,
			`/* Generated: ${new Date().toISOString()} */`,
			`import type { IssuerList } from './types.js';`,
			`export const iinRegEx = /^89(${Object.keys(list).join('|')})/;`,
			`export const e118IINList: IssuerList = ${JSON.stringify(
				list,
				null,
				2,
			)} as const;`,
		].join('\n\n'),
		{ parser: 'typescript' },
	),
	'utf-8',
)
console.log(`${target} written.`)
