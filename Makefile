
publish:
	npm run build
	npm publish

publish-sync: publish
	cnpm sync dora-plugin-atool-build
	tnpm sync dora-plugin-atool-build
