import type { IssuerList } from './types.js'

/**
 * This is a list of issuers, that we know operate, but they are not (yet) listed in the ITU-T E.118 database.
 */
const darkIssuers: Array<{
	countryCode: number
	networkCode: string
	country: string
	company: string
	url?: URL
}> = [
	{
		networkCode: '08',
		countryCode: 31,
		country: 'Netherlands',
		company: 'KPN Telecom B.V., Card Services',
	},
	{
		networkCode: '73',
		countryCode: 45,
		country: 'Denmark',
		company: 'Onomondo ApS',
	},
	{
		networkCode: '04',
		countryCode: 46,
		country: 'Sweden',
		company: 'eRate Sverige AB',
		url: new URL('http://telavox.se'),
	},
	{
		networkCode: '20',
		countryCode: 852,
		country: 'Hong Kong, China',
		company: 'Internet Initiative Japan Inc.',
		url: new URL('http://iij.ad.jp'),
	},
	{
		networkCode: '80',
		countryCode: 882,
		country: 'Germany',
		company: '1NCE GmbH',
		url: new URL('http://1nce.com'),
	},
	{
		networkCode: '440',
		countryCode: 883,
		country: 'Global',
		company: 'Truphone Limited',
	},
	{
		networkCode: '5100',
		countryCode: 883,
		country: 'Global',
		company: 'Voxbone SA',
	},
	{
		networkCode: '5110',
		countryCode: 883,
		country: 'Global',
		company: 'Bandwidth.com Inc',
	},
	{
		networkCode: '0452',
		countryCode: 55,
		country: 'Brazil',
		company: 'TIM',
		url: new URL('http://www.tim.com.br'),
	},
]

type Mutable<T> = {
	-readonly [P in keyof T]: T[P]
}

export const darkIssuersList: Mutable<IssuerList> = darkIssuers.reduce<
	Mutable<IssuerList>
>((list, issuer) => {
	list[`${issuer.countryCode}${issuer.networkCode}`] = [
		parseInt(`89${issuer.countryCode}${issuer.networkCode}`, 10),
		issuer.networkCode,
		issuer.countryCode,
		issuer.country,
		issuer.company,
		issuer.url ? [issuer.url.toString()] : [],
	]
	return list
}, {})
