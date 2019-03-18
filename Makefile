STAGE ?= local
include ./config.${STAGE}

export STAGE
export REACT_APP_FB_APP_ID
export REACT_APP_EXP_API_URL
export REACT_APP_BASE_URL

node_modules:
	npm install

start: node_modules
	npm start

dist: node_modules
	npm run build

invalidate:
	aws cloudfront create-invalidation --distribution-id EIJJC03H7RV4H --paths "/*"

deploy: dist invalidate
	sls client deploy -y --stage ${STAGE} --no-confirm