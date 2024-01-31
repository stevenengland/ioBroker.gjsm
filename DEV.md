## Integration tests

### Code checking commands

#### pre commit

`pre-commit install`: Will enable some checks that are run before each and every commit.

#### pre push

`npm run pre-push`: Checks a variety of code issues that one could run before pushing code to the code base.

### Checking objects and states for dev-server or integration test

```
/tmp/test-iobroker.gjsm/iob object get <id>
./.dev-server/default/iob object get <id>
```

### Adapter files won't update on new integration test runs

```
# With the rough club if nothing helps
npm cache clean --force
rm -R /tmp/test-...

# Rather filigree...
npm cache ls | grep gjsm | xargs npm cache clean
rm -R /tmp/test-iobroker.gjsm/node_modules/iobroker.gjsm
```

### dev-server as integration test instance

`npm run devserver:preparation -- --profile=integration --reset_env=true`: Prepare a dev-server scenario for integration testing - incl. resetting the complete scenario.
`npm run devserver:preparation -- --db_only=true --profile=integration`: Prepare a dev-server scenario for integration testing - but only prepare the db.
`dev-server watch integration`: Start a watch mode server for the integration scenario.
