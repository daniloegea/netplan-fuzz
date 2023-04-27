import * as common from "./common.js";

const openvswitch_schema = {
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
                    additionalProperties: false,
                    properties: {
                        "eth0": {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                "dhcp4": {
                                    type: "boolean"
                                }
                            }
                        },
                        "eth1": {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                "dhcp4": {
                                    type: "boolean"
                                }
                            }
                        },
                        "eth2": {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                "dhcp4": {
                                    type: "boolean"
                                }
                            }
                        }
                    },
                    required: ["eth0", "eth1", "eth2"]
                },
                openvswitch: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        "external-ids": {
                            type: "object",
                        },
                        "other-config": {
                            type: "object",
                        },
                        protocols: {
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["OpenFlow10", "OpenFlow11", "OpenFlow12", "OpenFlow13", "OpenFlow14", "OpenFlow15"]
                            }
                        },
                        ssl: {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                "ca-cert": {
                                    type: "string",
                                    faker: "system.filePath"
                                },
                                "certificate": {
                                    type: "string",
                                    faker: "system.filePath"
                                },
                                "private-key": {
                                    type: "string",
                                    faker: "system.filePath"
                                },
                            }
                        },
                        ports: {
                            type: "array",
                            items: {
                                type: "array",
                                minItems: 2,
                                maxItems: 2,
                                items: {
                                    type: "string",
                                    faker: "lorem.word"
                                },
                                
                            }
                        }
                    },
                },
            },
            required: ["vrfs", "ethernets"]
        }
    }
}


export default openvswitch_schema;