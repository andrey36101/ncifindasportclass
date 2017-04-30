REPORTER = xunit
MOCHA_OPTS = --ui tdd

test: export NODE_ENV = test
test:
	./node_modules/jenkins-mocha/bin/jenkins.js --cobertura test/index.js -t 6000000
	istanbul report --dir artifacts/coverage html
	echo Ending test
test-w:
	./node_modules/mocha/bin/mocha \
--reporter $(REPORTER) \
--growl \
--watch \
$(MOCHA_OPTS) \
tests/*.js

.PHONY: test test-w