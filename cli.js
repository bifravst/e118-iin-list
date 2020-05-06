#!/usr/bin/env node

const { identifyIssuer } = require('./')
const { isSome } = require('fp-ts/lib/Option')

const iccid = process.argv[process.argv.length - 1]

const issuer = identifyIssuer(iccid)
if (isSome(issuer)) {
	console.log(issuer.value)
} else {
	console.error(`Could not identify "${iccid}"!`)
	process.exit(1)
}
