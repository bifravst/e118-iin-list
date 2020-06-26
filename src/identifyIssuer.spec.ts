import { some, none } from 'fp-ts/lib/Option'
import { identifyIssuer } from './identifyIssuer'
import { Issuer } from './types'

describe('identifyIssuer', () => {
	it.each([
		[
			'89450421180216254864',
			some<Issuer>({
				iin: 894504,
				countryCode: 45,
				issuerIdentifierNumber: '04',
				countryName: 'Denmark',
				companyName: 'Telia Sonera A/S',
			}),
		],
		[
			'8931089318104284409F',
			some<Issuer>({
				companyName: 'KPN Telecom B.V., Card Services',
				countryCode: 31,
				countryName: 'Netherlands',
				iin: 893108,
				issuerIdentifierNumber: '08',
			}),
		],
		[
			'89882806660004909182',
			some<Issuer>({
				iin: 8988280,
				countryCode: 882,
				issuerIdentifierNumber: '80',
				countryName: 'Germany',
				companyName: '1NCE GmbH',
				companyURLs: ['http://1nce.com'],
			}),
		],
	])('should identify the issuer', (iccid, issuer) => {
		expect(identifyIssuer(iccid)).toEqual(issuer)
	})
	it('should not identify unknown issuers', () => {
		expect(identifyIssuer('123456')).toEqual(none)
	})
	it('should identify US issuers which use leading 0', () => {
		expect(identifyIssuer('8901260866666666666F')).toEqual(
			some<Issuer>({
				iin: 891260,
				countryCode: 1,
				issuerIdentifierNumber: '260',
				countryName: 'United States',
				companyName: 'T-Mobile USA',
				companyURLs: ['http://t-mobile.com'],
			}),
		)
	})
	it('should identify US issuers without leading 0', () => {
		expect(identifyIssuer('891260866666666666F')).toEqual(
			some<Issuer>({
				iin: 891260,
				countryCode: 1,
				issuerIdentifierNumber: '260',
				countryName: 'United States',
				companyName: 'T-Mobile USA',
				companyURLs: ['http://t-mobile.com'],
			}),
		)
	})
})
