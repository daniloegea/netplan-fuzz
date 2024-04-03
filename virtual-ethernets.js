import * as common from "./common.js";

const virtual_ethernets_schema = {
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
                "virtual-ethernets": {
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
                                ...common.common_properties,
                                peer: {
                                    type: "string",
                                },
                                optional: {
                                    type: "boolean"
                                },
                                macaddress: {
                                    type: "string",
                                    faker: "internet.mac"
                                },
                                /*
                                "ipv6-mtu": {
                                    type: "integer",
                                    minimum: 0
                                },
                                */
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
                                ...common.networkmanager_settings,
                                ...common.openvswitch
                            },
                        }
                    },
                    required: ["[azAZ09-]{1,15}"]
                },
            },
            required: ["virtual-ethernets"]
        }
    }
}


export default virtual_ethernets_schema;
