import type { IssuerList } from './types.js'

/**
 * This is a list of issuers, that we know operate, but they are not (yet) listed in the ITU-T E.118 database.
 */
const darkIssuers: Array<{
	prefix: number
	countryCode: number
	networkCode: string
	country: string
	company: string
	url?: URL
}> = [
	{
		prefix: 893108,
		networkCode: '08',
		countryCode: 31,
		country: 'Netherlands',
		company: 'KPN Telecom B.V., Card Services',
	},
	{
		prefix: 894573,
		networkCode: '73',
		countryCode: 45,
		country: 'Denmark',
		company: 'Onomondo ApS',
	},
	{
		prefix: 894604,
		networkCode: '04',
		countryCode: 46,
		country: 'Sweden',
		company: 'eRate Sverige AB',
		url: new URL('http://telavox.se'),
	},
	{
		prefix: 8985220,
		networkCode: '20',
		countryCode: 852,
		country: 'Hong Kong, China',
		company: 'Internet Initiative Japan Inc.',
		url: new URL('http://iij.ad.jp'),
	},
	{
		prefix: 8988280,
		networkCode: '80',
		countryCode: 882,
		country: 'Germany',
		company: '1NCE GmbH',
		url: new URL('http://1nce.com'),
	},
	{
		prefix: 89883440,
		networkCode: '440',
		countryCode: 883,
		country: 'Global',
		company: 'Truphone Limited',
	},
	{
		prefix: 898835100,
		networkCode: '5100',
		countryCode: 883,
		country: 'Global',
		company: 'Voxbone SA',
	},
	{
		prefix: 898835110,
		networkCode: '5110',
		countryCode: 883,
		country: 'Global',
		company: 'Bandwidth.com Inc',
	},
]

type Mutable<T> = {
	-readonly [P in keyof T]: T[P]
}

export const darkIssuersList: Mutable<IssuerList> = darkIssuers.reduce<
	Mutable<IssuerList>
>((list, issuer) => {
	list[`${issuer.countryCode}${issuer.networkCode}`] = [
		issuer.prefix,
		issuer.networkCode,
		issuer.countryCode,
		issuer.country,
		issuer.company,
		issuer.url ? [issuer.url.toString()] : [],
	]
	return list
}, {})
