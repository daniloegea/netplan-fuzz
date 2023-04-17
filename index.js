import jsf from "json-schema-faker";
import writeYamlFile from 'write-yaml-file';
import { JSONSchemaFaker } from "json-schema-faker";
import { faker } from '@faker-js/faker';

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
    return faker;
});

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
                        ".*$": {
                            additionalProperties: false,
                            properties: {
                                match: {
                                    type: "object",
                                    additionalProperties: false,
                                    properties: {
                                        name: {
                                            type: "string",
                                        },
                                        driver: {
                                            type: "string"
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
                                                faker: "ipv4.withprefix",
                                                format: "ipv4"
                                            },
                                            {
                                                type: "string",
                                                faker: "ipv6.withprefix",
                                                format: "ipv6"
                                            }
                                        ]
                                    }
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
                                                },
                                                {
                                                    type: "object",
                                                    patternProperties: {
                                                        ".*$": {
                                                            format: "ipv4",
                                                            faker: "internet.ipv4",
                                                            type: "object",
                                                            additionalProperties: false,
                                                            properties: {
                                                                lifetime: {
                                                                    type: "string",
                                                                    enum: ["forever", "0"]
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
};


const value = jsf.generate(schema);
writeYamlFile('fakeroot/etc/netplan/foo.yaml', value);

