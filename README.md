netplan-fuzz uses [json-schema-faker](https://github.com/json-schema-faker/json-schema-faker) to generate random Netplan YAML files from a JSON schema.

## How to use it

* Clone and install the dependencies
```
git clone https://github.com/daniloegea/netplan-fuzz.git
cd netplan-fuzz
npm install
```

* Run it
```
node index.js
```

A YAML file will be created in `./fakeroot/etc/netplan`

* Run netplan against the YAML

```
netplan generate --root-dir fakeroot
```