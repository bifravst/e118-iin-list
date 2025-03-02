import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { identifyIssuer } from './identifyIssuer.js'

void describe('identifyIssuer', () => {
	for (const [iccid, issuer] of [
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
				companyURLs: ['http://1nce.com/'],
			},
		],
		[
			'89852202401310123456',
			{
				iin: 8985220,
				countryCode: 852,
				issuerIdentifierNumber: '20',
				countryName: 'Hong Kong, China',
				companyName: 'Internet Initiative Japan Inc.',
				companyURLs: ['http://iij.ad.jp/'],
			},
		],
		[
			'89457387300008851969',
			{
				iin: 894573,
				countryCode: 45,
				issuerIdentifierNumber: '73',
				countryName: 'Denmark',
				companyName: 'Onomondo ApS',
			},
		],
		[
			'89550452000016123456',
			{
				iin: 89550452,
				countryCode: 55,
				issuerIdentifierNumber: '0452',
				countryName: 'Brazil',
				companyName: 'TIM',
				companyURLs: ['http://www.tim.com.br/'],
			},
		],
		[
			'89882610000000001234',
			{
				iin: 89882610,
				countryCode: 882,
				issuerIdentifierNumber: '610',
				countryName: 'Global',
				companyName: 'Myriota',
				companyURLs: ['https://myriota.com/'],
			},
		],
		[
			'89901980100200008857',
			{
				iin: 89901980,
				countryCode: 901,
				issuerIdentifierNumber: '980',
				countryName: 'United States',
				companyName: 'Skylo',
				companyURLs: ['https://skylo.tech/'],
			},
		],
	] as [string, ReturnType<typeof identifyIssuer>][]) {
		void it(`should identify the ICCID ${iccid} as ${JSON.stringify(issuer)}`, () =>
			assert.deepEqual(identifyIssuer(iccid), issuer))
	}
	void it('should not identify unknown issuers', () =>
		assert.equal(identifyIssuer('123456'), undefined))
	void it('should identify US issuers which use leading 0', () =>
		assert.deepEqual(identifyIssuer('8901260866666666666F'), {
			iin: 891260,
			countryCode: 1,
			issuerIdentifierNumber: '260',
			countryName: 'United States',
			companyName: 'T-Mobile USA',
			companyURLs: ['http://t-mobile.com'],
		}))
	void it('should identify US issuers without leading 0', () =>
		assert.deepEqual(identifyIssuer('891260866666666666F'), {
			iin: 891260,
			countryCode: 1,
			issuerIdentifierNumber: '260',
			countryName: 'United States',
			companyName: 'T-Mobile USA',
			companyURLs: ['http://t-mobile.com'],
		}))
})
