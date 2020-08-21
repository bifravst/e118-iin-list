#!/usr/bin/env node

const { identifyIssuer } = require('./')
const { isSome } = require('fp-ts/lib/Option')
const fs = require('fs')
const { bugs } = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

const iccid = process.argv[process.argv.length - 1]

const issuer = identifyIssuer(iccid)
if (isSome(issuer)) {
	console.log(JSON.stringify(issuer.value, null, 2))
} else {
	console.error(`The vendor of your ICCID "${iccid}" could not be identified!`)
	console.error(
		`Please open a new issue by following this link: ${
			bugs.url
		}/new?title=${encodeURIComponent(
			`Could not identify ICCID ${iccid.replace(/.{6}$/, 'XXXXXX')}`,
		)}&body=${encodeURIComponent(
			'<!-- Please provide details about the SIM vendor. -->',
		)}`,
	)
	process.exit(1)
}
