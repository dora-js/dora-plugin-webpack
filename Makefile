
publish:
	npm run build
	npm publish

publish-sync: publish
	cnpm sync
	tnpm sync
