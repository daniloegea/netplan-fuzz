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
                        "[azAZ09-]{1,15}": {
                            additionalProperties: false,
                            properties: {
                                "match": {
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
                                    },
                                },
                                "set-name": {
                                    type: "string"
                                },
                                optional: {
                                    type: "boolean"
                                },
                                wakeonlan: {
                                    type: "boolean"
                                },
                                "emit-lldp": {
                                    type: "boolean"
                                },
                                "receive-checksum-offload": {
                                    type: "boolean"
                                },
                                "transmit-checksum-offload": {
                                    type: "boolean"
                                },
                                "tcp-segmentation-offload": {
                                    type: "boolean"
                                },
                                "tcp6-segmentation-offload": {
                                    type: "boolean"
                                },
                                "generic-segmentation-offload": {
                                    type: "boolean"
                                },
                                "generic-receive-offload": {
                                    type: "boolean"
                                },
                                "large-receive-offload": {
                                    type: "boolean"
                                },
                                macaddress: {
                                    type: "string",
                                    faker: "internet.mac"
                                },
                                dhcp4: {
                                    type: "boolean"
                                },
                                dhcp6: {
                                    type: "boolean"
                                },
                                "ipv6-mtu": {
                                    type: "integer",
                                    minimum: 0
                                },
                                "ipv6-privacy": {
                                    type: "boolean"
                                },
                                "link-local": {
                                    type: "array",
                                    items: [{
                                        type: "string",
                                        enum: ["ipv4", "ipv6"],
                                    }
                                    ]
                                },
                                "ignore-carrier": {
                                    type: "boolean"
                                },
                                critical: {
                                    type: "boolean"
                                },
                                "dhcp-identifier": {
                                    type: "string",
                                    enum: ["duid", "mac"]
                                },
                                "accept-ra": {
                                    type: "boolean"
                                },
                                gateway4: {
                                    type: "string",
                                    faker: "internet.ipv4"
                                },
                                gateway6: {
                                    type: "string",
                                    faker: "internet.ipv6"
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
                                                minimum: 0
                                            },
                                            type: {
                                                type: "string",
                                                enum: ["unicast", "anycast", "blackhole", "broadcast", "local", "multicast", "nat", "prohibit", "throw", "unreachable", "xresolve"]
                                            },
                                            scope: {
                                                type: "string",
                                                enum: ["global", "link", "host"]
                                            },
                                            table: {
                                                type: "integer",
                                                minimum: 0
                                            },
                                            mtu: {
                                                type: "integer",
                                                minimum: 0
                                            },
                                            "congestion-window": {
                                                type: "integer",
                                                minimum: 0
                                            },
                                            "advertised-receive-window": {
                                                type: "integer",
                                                minimum: 0
                                            }

                                        },
                                        required: ["to", "via"]
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
                                                minimum: 0,
                                            },
                                            priority: {
                                                type: "integer",
                                                minimum: 0,
                                            },
                                            mark: {
                                                type: "integer",
                                                minimum: 0,
                                            },
                                            "type-of-service": {
                                                type: "integer",
                                                minimum: 0,
                                                maximum: 255
                                            }
                                        },
                                        required: ["to", "via"],
                                    }
                                }
                            },
                        }
                    }
                },
                wifis: {
                    type: "object",
                    properties: {
                        renderer: {
                            type: "string",
                            enum: ["networkd", "NetworkManager"]
                        },
                    },
                    patternProperties: {
                        "[azAZ09-]{1,15}": {
                            additionalProperties: false,
                            properties: {
                                "match": {
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
                                    },
                                },
                                "set-name": {
                                    type: "string"
                                },
                                optional: {
                                    type: "boolean"
                                },
                                "emit-lldp": {
                                    type: "boolean"
                                },
                                "receive-checksum-offload": {
                                    type: "boolean"
                                },
                                "transmit-checksum-offload": {
                                    type: "boolean"
                                },
                                "tcp-segmentation-offload": {
                                    type: "boolean"
                                },
                                "tcp6-segmentation-offload": {
                                    type: "boolean"
                                },
                                "generic-segmentation-offload": {
                                    type: "boolean"
                                },
                                "generic-receive-offload": {
                                    type: "boolean"
                                },
                                "large-receive-offload": {
                                    type: "boolean"
                                },
                                macaddress: {
                                    type: "string",
                                    faker: "internet.mac"
                                },
                                dhcp4: {
                                    type: "boolean"
                                },
                                dhcp6: {
                                    type: "boolean"
                                },
                                "ipv6-mtu": {
                                    type: "integer",
                                    minimum: 0
                                },
                                "ipv6-privacy": {
                                    type: "boolean"
                                },
                                "link-local": {
                                    type: "array",
                                    items: [{
                                        type: "string",
                                        enum: ["ipv4", "ipv6"],
                                    }
                                    ]
                                },
                                "ignore-carrier": {
                                    type: "boolean"
                                },
                                critical: {
                                    type: "boolean"
                                },
                                "dhcp-identifier": {
                                    type: "string",
                                    enum: ["duid", "mac"]
                                },
                                "accept-ra": {
                                    type: "boolean"
                                },
                                gateway4: {
                                    type: "string",
                                    faker: "internet.ipv4"
                                },
                                gateway6: {
                                    type: "string",
                                    faker: "internet.ipv6"
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
                                                minimum: 0
                                            },
                                            type: {
                                                type: "string",
                                                enum: ["unicast", "anycast", "blackhole", "broadcast", "local", "multicast", "nat", "prohibit", "throw", "unreachable", "xresolve"]
                                            },
                                            scope: {
                                                type: "string",
                                                enum: ["global", "link", "host"]
                                            },
                                            table: {
                                                type: "integer",
                                                minimum: 0
                                            },
                                            mtu: {
                                                type: "integer",
                                                minimum: 0
                                            },
                                            "congestion-window": {
                                                type: "integer",
                                                minimum: 0
                                            },
                                            "advertised-receive-window": {
                                                type: "integer",
                                                minimum: 0
                                            }

                                        },
                                        required: ["to", "via"]
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
                                                minimum: 0,
                                            },
                                            priority: {
                                                type: "integer",
                                                minimum: 0,
                                            },
                                            mark: {
                                                type: "integer",
                                                minimum: 0,
                                            },
                                            "type-of-service": {
                                                type: "integer",
                                                minimum: 0,
                                                maximum: 255
                                            }
                                        },
                                        required: ["to", "via"],
                                    }
                                },
                                "access-points": {
                                    type: "object",
                                    patternProperties: {
                                        "[azAZ09 ]+": {
                                            type: "object",
                                            additionalProperties: false,
                                            properties: {
                                                password: {
                                                    type: "string"
                                                },
                                                mode: {
                                                    type: "string",
                                                    enum: ["infrastructure", "ap", "adhoc"]
                                                },
                                                bssid: {
                                                    type: "string",
                                                    faker: "internet.mac"
                                                },
                                                band: {
                                                    type: "string",
                                                    enum: ["5GHz", "2.4GHz"]
                                                },
                                                channel: {
                                                    type: "integer",
                                                    minimum: 0
                                                },
                                                hidden: {
                                                    type: "boolean"
                                                },
                                                auth: {
                                                    type: "object",
                                                    additionalProperties: false,
                                                    properties: {
                                                        "key-management": {
                                                            type: "string",
                                                            enum: ["none", "psk", "eap"]
                                                        },
                                                        password: {
                                                            type: "string"
                                                        },
                                                        method: {
                                                            type: "string",
                                                            enum: ["tls", "peap", "ttls"]
                                                        },
                                                        identity: {
                                                            type: "string"
                                                        },
                                                        "anonymous-identity": {
                                                            type: "string",
                                                        },
                                                        "ca-certificate": {
                                                            type: "string"
                                                        },
                                                        "client-certificate": {
                                                            type: "string"
                                                        },
                                                        "client-key": {
                                                            type: "string"
                                                        },
                                                        "client-key-password": {
                                                            type: "string"
                                                        },
                                                        "phase2-auth": {
                                                            type: "string"
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                    },
                                    minItems: 1,
                                },
                            }
                        }
                    },
                }
            },
            required: ["ethernets"],
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

