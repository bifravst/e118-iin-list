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
					[iin]: {
						iin,
						countryCode: parseInt(countryCode, 10),
						issuerIdentifierNumber,
						countryName: CountryGeographicalarea[0],
						companyName: CompanyNameAddress[0],
						...(companyURLs && { companyURLs }),
					},
				}
			},
			{} as IssuerList,
		)
		fs.writeFileSync(
			target,
			prettier.format(
				[
					`import {IssuerList} from './types';`,
					`export const iinRegEx = /^(${Object.keys(list).join('|')})/;`,
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
