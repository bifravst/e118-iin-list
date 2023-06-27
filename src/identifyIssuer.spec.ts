import { identifyIssuer } from './identifyIssuer.js'

describe('identifyIssuer', () => {
	it.each([
		[
			'89450421180216254864',
			{
				iin: 894504,
				countryCode: 45,
				issuerIdentifierNumber: '04',
				countryName: 'Denmark',
				companyName: 'Telia Sonera A/S',
			},
		],
		[
			'8931089318104284409F',
			{
				companyName: 'KPN Telecom B.V., Card Services',
				countryCode: 31,
				countryName: 'Netherlands',
				iin: 893108,
				issuerIdentifierNumber: '08',
			},
		],
		[
			'89882806660004909182',
			{
				iin: 8988280,
				countryCode: 882,
				issuerIdentifierNumber: '80',
				countryName: 'Germany',
				companyName: '1NCE GmbH',
				companyURLs: ['http://1nce.com'],
			},
		],
	])('should identify the issuer', (iccid, issuer) => {
		expect(identifyIssuer(iccid)).toEqual(issuer)
	})
	it('should not identify unknown issuers', () => {
		expect(identifyIssuer('123456')).toBeUndefined()
	})
	it('should identify US issuers which use leading 0', () => {
		expect(identifyIssuer('8901260866666666666F')).toEqual({
			iin: 891260,
			countryCode: 1,
			issuerIdentifierNumber: '260',
			countryName: 'United States',
			companyName: 'T-Mobile USA',
			companyURLs: ['http://t-mobile.com'],
		})
	})
	it('should identify US issuers without leading 0', () => {
		expect(identifyIssuer('891260866666666666F')).toEqual({
			iin: 891260,
			countryCode: 1,
			issuerIdentifierNumber: '260',
			countryName: 'United States',
			companyName: 'T-Mobile USA',
			companyURLs: ['http://t-mobile.com'],
		})
	})
})
