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
		['8931089318104284409F', none], // Update of database required
		['89882806660004909182', none], // Update of database required
	])('should identify the issuer', (iccid, issuer) => {
		expect(identifyIssuer(iccid)).toEqual(issuer)
	})
})
