import common_properties from "./common.js";

const wifis_schema = {
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
                                ...common_properties,
                                
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
                                    type: "string",
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
                                    "required": ["[azAZ09 ]+"]
                                },
                            },
                            "required": ["access-points", "match", "set-name"],
                            "dependencies": {
                                "set-name": ["match"]
                            }
                        }
                    },
                }
            },
            required: ["wifis"],
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

export default wifis_schema;