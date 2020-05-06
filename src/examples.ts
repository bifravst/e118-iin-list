import { identifyIssuer } from './identifyIssuer'
import { isSome } from 'fp-ts/lib/Option'

const issuer = identifyIssuer('89450421180216254864')
if (isSome(issuer)) {
	console.log(issuer.value.companyName) // Telia Sonera A/S
}
