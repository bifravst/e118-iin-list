import { some } from 'fp-ts/lib/Option'
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
				companyURLs: ['https://1nce.com/'],
			}),
		],
	])('should identify the issuer', (iccid, issuer) => {
		expect(identifyIssuer(iccid)).toEqual(issuer)
	})
})
