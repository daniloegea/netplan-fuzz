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

A bunch YAML files will be created in the directory `fakedata`.

You can create more YAMLs per device type with:

```
node index.js 100
```

In this example, 100 YAMLs per device type will be created.

* Run netplan against the YAML

```
mkdir -p fakeroot/etc/netplan
cp fakedata/someyaml.yaml fakeroot/etc/netplan/
netplan generate --root-dir fakeroot
```

* Using the runner.sh script

You can also automatically test netplan against all the generated YAML files:

```
bash runner.sh /path/to/netplan_source_code 100
```

This script will build netplan, generate the random YAMLs and test the netplan generator against each one of them.
