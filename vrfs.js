import common_properties from "./common.js";

const vrfs_schema = {
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
                vrfs: {
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
                                table: {
                                    type: "integer",
                                    minimum: 100,
                                    maximum: 100
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
                                                minimum: 100,
                                                maximum: 100
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
                                                minimum: 100,
                                                maximum: 100
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
                            required: ["table"]
                        }
                    },
                    required: ["[azAZ09-]{1,15}"]
                },
            },
            required: ["ethernets"],
            definitions: {
                positiveInt: {
                    type: "integer",
                    minimum: 0,
                    exclusiveMinimum: true,
                }
            }
        }
    }
}


export default vrfs_schema;