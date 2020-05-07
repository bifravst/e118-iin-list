export type Issuer = {
	iin: number
	issuerIdentifierNumber: string
	countryCode: number
	countryName: string
	companyName: string
	/**
	 * Extracted from the contact emails
	 */
	companyURLs?: readonly string[]
}

export type IssuerList = Readonly<
	Record<
		string,
		readonly [number, string, number, string, string, readonly string[]]
	>
>
