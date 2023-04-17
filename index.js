import jsf from "json-schema-faker";
import writeYamlFile from 'write-yaml-file';
import { JSONSchemaFaker } from "json-schema-faker";
import { faker } from '@faker-js/faker';

import * as fs from 'node:fs';

JSONSchemaFaker.extend('faker', () => {
    faker.ipv4 = {
        withprefix: _ => {
            return faker.internet.ipv4() + '/24';
        }
    }
    faker.ipv6 = {
        withprefix: _ => {
            return faker.internet.ipv6() + '/64';
        }
    }
    faker.ipv4_or_ipv6 = {
        withprefix: _ => {
            if (Math.random() % 2 == 0) {
                return faker.internet.ipv6() + '/64';
            } else {
                return faker.internet.ipv4() + '/24';
            }
        },
        withoutprefix: _ => {
            if (Math.random() % 2 == 0) {
                return faker.internet.ipv6();
            } else {
                return faker.internet.ipv4();
            }
        }
    }
    return faker;
});

const ipv4_or_ipv6 = faker.internet.ipv4();

const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
        network: {
            type: "object",
            additionalProperties: false,
            required: ["ethernets"],
            properties: {
                renderer: {
                    type: "string",
                    enum: ["networkd", "NetworkManager"]
                },
                version: {
                    type: "integer",
                    minimum: 2,
                    maximum: 2
                },
                ethernets: {
                    type: "object",
                    properties: {
                        renderer: {
                            type: "string",
                            enum: ["networkd", "NetworkManager"]
                        },
                    },
                    patternProperties: {
                        "[azAZ09-]{0,18}": {
                            additionalProperties: false,
                            properties: {
                                match: {
                                    type: "object",
                                    additionalProperties: false,
                                    properties: {
                                        name: {
                                            type: "string",
                                            faker: "lorem.word"
                                        },
                                        driver: {
                                            type: "string",
                                            faker: "lorem.word"
                                        },
                                        macaddress: {
                                            type: "string",
                                            faker: "internet.mac"
                                        }
                                    }
                                },
                                optional: {
                                    type: "boolean"
                                },
                                macaddress: {
                                    type: "string",
                                    faker: "internet.mac"
                                },
                                addresses: {
                                    type: "array",
                                    items: {
                                        anyOf: [
                                            {
                                                type: "string",
                                                faker: "ipv4_or_ipv6.withprefix",
                                            },
                                            {
                                                type: "object",
                                                patternProperties: {
                                                    "192\\.168\\.[1-9]{2}\\.0/24": {
                                                        type: "object",
                                                        additionalProperties: false,
                                                        properties: {
                                                            lifetime: {
                                                                type: "string",
                                                                enum: ["forever", 0]
                                                            },
                                                            label: {
                                                                type: "string",
                                                                maxLength: 15,
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                },
                                nameservers: {
                                    type: "object",
                                    additionalProperties: false,
                                    properties: {
                                        search: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                                faker: "internet.domainName",
                                            }
                                        },
                                        addresses: {
                                            type: "array",
                                            items: {

                                                anyOf: [
                                                    {
                                                        type: "string",
                                                        faker: "internet.ipv4",
                                                        format: "ipv4"
                                                    },
                                                    {
                                                        type: "string",
                                                        faker: "internet.ipv6",
                                                        format: "ipv6"
                                                    }

                                                ]
                                            }
                                        }
                                    }
                                },
                                routes: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        additionalProperties: false,
                                        properties: {
                                            from: {
                                                type: "string",
                                                faker: "ipv4_or_ipv6.withprefix"
                                            },
                                            to: {
                                                type: "string",
                                                faker: "ipv4_or_ipv6.withprefix"
                                            },
                                            via: {
                                                type: "string",
                                                faker: "ipv4_or_ipv6.withoutprefix"
                                            },
                                            "on-link": {
                                                type: "boolean"
                                            },
                                            metric: {
                                                type: "integer",
                                                minimum: -100,
                                            },
                                            type: {
                                                type: "string",
                                                enum: ["unicast", "anycast", "blackhole", "broadcast", "local", "multicast", "nat", "prohibit", "throw", "unreachable", "xresolve", "aadas*&%"]
                                            },
                                            scope: {
                                                type: "string",
                                                enum: ["global", "link", "host", "adasd*&%&"]
                                            },
                                            table: {
                                                type: "integer",
                                                minimum: -100
                                            },
                                            mtu: {
                                                type: "integer",
                                                minimum: -100
                                            },
                                            "congestion-window": {
                                                type: "integer",
                                                minimum: -100
                                            },
                                            "advertised-receive-window": {
                                                type: "integer",
                                                minimum: -100
                                            }

                                        },
                                        required: ["to"]
                                    }
                                },
                                "routing-policy": {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        additionalProperties: false,
                                        properties: {
                                            from: {
                                                type: "string",
                                                faker: "ipv4_or_ipv6.withprefix"
                                            },
                                            to: {
                                                type: "string",
                                                faker: "ipv4_or_ipv6.withprefix"
                                            },
                                            table: {
                                                type: "integer",
                                                minimum: -100
                                            },
                                            priority: {
                                                type: "integer",
                                                minimum: -10
                                            },
                                            mark: {
                                                type: "integer",
                                                minimum: -10
                                            },
                                            "type-of-service": {
                                                type: "integer",
                                                minimum: -10,
                                                maximum: 300
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    },
                },
            },
            required: ["network"],
            definitions: {
                positiveInt: {
                    type: "integer",
                    minimum: 0,
                    exclusiveMinimum: true,
                },
            },
        }

    }
}
fs.mkdirSync("fakeroot/etc/netplan", { recursive: true });

const value = jsf.generate(schema);
writeYamlFile('fakeroot/etc/netplan/foo.yaml', value);

