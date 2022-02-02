#!/usr/bin/env node

import { identifyIssuer } from './dist/identifyIssuer.js'

const iccid = process.argv[process.argv.length - 1]

const issuer = identifyIssuer(iccid)
if (isSome(issuer)) {
	console.log(JSON.stringify(issuer.value, null, 2))
} else {
	console.error(`The vendor of your ICCID "${iccid}" could not be identified!`)
	console.error(
		`Please open a new issue by following this link: https://github.com/cellprobe/e118-iin-list/issues/new?title=${encodeURIComponent(
			`Could not identify ICCID ${iccid.replace(/.{6}$/, 'XXXXXX')}`,
		)}&body=${encodeURIComponent(
			'<!-- Please provide details about the SIM vendor. -->',
		)}`,
	)
	process.exit(1)
}
