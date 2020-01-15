default:
	@echo "Please specify a command to run"

install:
	yarn

test:
	yarn test

example:
	yarn example

publish:
	yarn login
	yarn publish