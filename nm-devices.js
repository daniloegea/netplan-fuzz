import common_properties from "./common.js";

const nmdevices_schema = {
    type: "object",
    additionalProperties: false,
    properties: {
        network: {
            type: "object",
            additionalProperties: false,
            properties: {
                renderer: {
                    type: "string",
                    enum: ["NetworkManager"]
                },
                version: {
                    type: "integer",
                    minimum: 2,
                    maximum: 2
                },
                "nm-devices": {
                    type: "object",
                    properties: {
                        renderer: {
                            type: "string",
                            enum: ["NetworkManager"]
                        },
                    },
                    patternProperties: {
                        "[azAZ09-]{1,15}": {
                            additionalProperties: false,
                            properties: {
                                renderer: {
                                    type: "string",
                                    enum: ["NetworkManager"]
                                },
                                networkmanager: {
                                    type: "object",
                                    additionalProperties: false,
                                    properties: {
                                        uuid: {
                                            type: "string"
                                        },
                                        name: {
                                            type: "string"
                                        },
                                        passthrough: {
                                            type: "object",
                                            properties: {
                                                "connection.type": {
                                                    type: "string"
                                                }
                                            }
                                        }
                                    }
                                },
                            },
                            required: ["networkmanager"]
                        }
                    },
                    required: ["[azAZ09-]{1,15}"]
                },
            },
            required: ["nm-devices"],
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


export default nmdevices_schema;