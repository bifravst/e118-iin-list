export type Issuer = {
	iin: number
	countryCode: number
	countryName: string
	companyName: string
	/**
	 * Extracted from the contact emails
	 */
	companyURLs?: readonly string[]
	issuerIdentifierNumber: string
}

export type IssuerList = Readonly<Record<string, Issuer>>
