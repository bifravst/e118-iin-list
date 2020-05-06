import { Option, none, some } from 'fp-ts/lib/Option'
import { Issuer } from './types'
import { iinRegEx, e118IINList } from './list'

/**
 * Identifies a SIM card issuer by the given ICCID
 */
export const identifyIssuer = (iccid: string): Option<Issuer> => {
	const iinMatch = iinRegEx.exec(iccid)
	if (!iinMatch) return none
	const iin = iinMatch[0]
	const issuer = e118IINList[iin]
	return some(issuer)
}
