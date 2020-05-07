import { Option, none, some } from 'fp-ts/lib/Option'
import { Issuer } from './types'
import { iinRegEx, e118IINList } from './list'

/**
 * Identifies a SIM card issuer by the given ICCID
 */
export const identifyIssuer = (iccid: string): Option<Issuer> => {
	const iinMatch = iinRegEx.exec(iccid)
	if (!iinMatch) return none
	const issuer = e118IINList[iinMatch[1]]
	return some({
		iin: issuer[0],
		issuerIdentifierNumber: issuer[1],
		countryCode: issuer[2],
		countryName: issuer[3],
		companyName: issuer[4],
		...(issuer[5].length && { companyURLs: issuer[5] }),
	})
}
