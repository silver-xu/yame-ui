STAGE ?= local
include ./config.${STAGE}

export STAGE
export REACT_APP_FB_APP_ID
export REACT_APP_EXP_API_URL

node_modules:
	npm install

start: node_modules		
	npm start

dist-dev: node_modules
	export STAGE=dev && npm run build

deploy: dist-dev
	sls client deploy -y --stage ${STAGE}