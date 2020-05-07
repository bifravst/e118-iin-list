import * as csv from 'csv-parser'
import * as fs from 'fs'
import * as path from 'path'
import * as prettier from 'prettier'
import { IssuerList } from './types'

type ParsedCSVEntry = {
	CountryGeographicalarea: string[]
	CompanyNameAddress: string[]
	IssuerIdentifierNumber: string[]
	Contact: string[]
}

const results: ParsedCSVEntry[] = []

const target = path.join(process.cwd(), 'src', 'list.ts')

fs.createReadStream('list.csv')
	.pipe(
		csv({
			mapHeaders: ({ header }) =>
				header.replace(/\n/g, ' ').replace(/[ /]/g, '').trim(),
			mapValues: ({ value }) => value.split('\n').map((v: string) => v.trim()),
		}),
	)
	.on('data', (data) => results.push(data))
	.on('end', () => {
		const list: IssuerList = results.reduce(
			(
				list,
				{
					IssuerIdentifierNumber,
					CountryGeographicalarea,
					CompanyNameAddress,
					Contact,
				},
			) => {
				const [
					,
					countryCode,
					issuerIdentifierNumber,
				] = IssuerIdentifierNumber[0].split(' ')
				const iin = parseInt(IssuerIdentifierNumber[0].replace(/ /g, ''), 10)
				const key = `${countryCode}${issuerIdentifierNumber}`
				const emailRegEx = /e-mail ?: ?(.+)/i
				const companyURLs = Contact.reduce((urls, s) => {
					const m = emailRegEx.exec(s)
					if (!m) return urls
					return m[1]
						.replace(/ /g, '')
						.split(';')
						.map((email) => email.replace(/^.+@/, 'http://').toLowerCase())
						.filter((url, k, urls) => urls.indexOf(url) === k)
				}, undefined as undefined | string[])
				return {
					...list,
					[key]: [
						iin,
						issuerIdentifierNumber,
						parseInt(countryCode, 10),
						CountryGeographicalarea[0],
						CompanyNameAddress[0],
						companyURLs ?? [],
					],
				}
			},
			{} as IssuerList,
		)
		fs.writeFileSync(
			target,
			prettier.format(
				[
					`/* Auto-generated file. Do not change! */`,
					`import {IssuerList} from './types';`,
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
	})
