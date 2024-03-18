import { e118IINList, iinRegEx } from './list.js'
import type { Issuer } from './types.js'

/**
 * Identifies a SIM card issuer by the given ICCID
 */
export const identifyIssuer = (iccid: string): Issuer | undefined => {
	const iinMatch = iinRegEx.exec(iccid)
	if (!iinMatch) return undefined
	const issuer = e118IINList[iinMatch[1]]
	return {
		iin: issuer[0],
		issuerIdentifierNumber: issuer[1],
		countryCode: issuer[2],
		countryName: issuer[3],
		companyName: issuer[4],
		...(issuer[5].length && { companyURLs: issuer[5] }),
	}
}
