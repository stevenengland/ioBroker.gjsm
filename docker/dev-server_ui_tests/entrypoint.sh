#!/bin/bash

npm run devserver:preparation -- --reset_env=true --profile=$IOB_DEVSERVER_PROFILE --tests-from=$IOB_DEVSERVER_TESTS_FROM
npx dev-server run $IOB_DEVSERVER_PROFILE