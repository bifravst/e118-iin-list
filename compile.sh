#!/bin/bash

set -e
set -x

npx swc -C jsc.experimental.keepImportAttributes=true -C jsc.experimental.emitAssertForImportAttributes=true -d dist ./src/*
mv dist/src/* dist/
npx tsc