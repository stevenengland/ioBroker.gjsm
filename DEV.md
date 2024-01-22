## Integration tests

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
