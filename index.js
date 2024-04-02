import writeYamlFile from 'write-yaml-file';
import { JSONSchemaFaker } from "json-schema-faker";
import { faker } from '@faker-js/faker';

import * as fs from 'node:fs';

import ethernets_schema from './ethernets.js';
import wifis_schema from './wifis.js';
import vrfs_schema from './vrfs.js';
import vlans_schema from './vlans.js';
import bridges_schema from './bridges.js';
import bonds_schema from './bonds.js';
import nmdevices_schema from './nm-devices.js';
import { wireguard_schema, sit_schema, vxlan_schema } from './tunnels.js';
import modems_schema from './modems.js';
import openvswitch_schema from './openvswitch.js'

import { randomBytes } from "node:crypto";

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
            if (Math.floor(Math.random() * 1000) % 2 == 0) {
                return faker.internet.ipv6() + '/64';
            } else {
                return faker.internet.ipv4() + '/24';
            }
        },
        withoutprefix: _ => {
            if (Math.floor(Math.random() * 1000) % 2 == 0) {
                return faker.internet.ipv6();
            } else {
                return faker.internet.ipv4();
            }
        },
        withport: _ => {
            var port = Math.floor(Math.random() * 65536);
            if (Math.floor(Math.random() * 1000) % 2 == 0) {
                return faker.internet.ipv6() + ":" + port.toString();
            } else {
                return faker.internet.ipv4() + ":" + port.toString();
            }
        }
    }
    faker.openvswitch = {
        controller_address: _ => {
            var number = Math.floor(Math.random() * 65536) % 6;
            if (number == 0) {
                return "unix:" + faker.system.filePath();
            } else if (number == 1) {
                return "punix:" + faker.system.filePath();
            } else if (number == 2) {
                return "tcp:" + faker.internet.ipv4() + ":" + faker.internet.port();
            } else if (number == 3) {
                return "ptcp:" + faker.internet.port() + ":" + faker.internet.ipv4();
            } else if (number == 4) {
                return "ssl:" + faker.internet.ipv4() + ":" + faker.internet.port();
            } else if (number == 5) {
                return "pssl:" + faker.internet.port() + ":" + faker.internet.ipv4();
            }
        }
    }
    return faker;
});


function apply_fixes(object, object_type) {
    var renderer = ""
    if (!("network" in object) || !(object_type in object["network"])) {
        return;
    }

    if ("renderer" in object) {
        renderer = object["renderer"];
    }

    var interfaces = object["network"][object_type]

    if ("renderer" in object["network"]) {
        renderer = object["network"]["renderer"];
    }

    Object.keys(interfaces).forEach(function (key) {
        var has_address_options = false;

        if (key != "renderer") {
            var iface = interfaces[key];

            if ("renderer" in iface) {
                renderer = iface["renderer"];
            }

            /*
            If addresses as objects were generated, set the renderer to networkd.
            NetworkManager doesn't support addresses options
            */
            if ("addresses" in iface) {
                Object.keys(iface["addresses"]).forEach(function (key) {
                    if (typeof iface["addresses"][key] === 'object') {
                        interfaces["renderer"] = "networkd";
                        object["network"]["renderer"] = "networkd";
                        iface["renderer"] = "networkd";
                        renderer = "networkd";
                        has_address_options = true;
                        return;
                    }
                });
            }

            /*
            If it has the networkmanager property and the renderer is not NetworkManager delete it
            */
            if ("networkmanager" in iface && renderer != "NetworkManager") {
                delete object["network"][object_type][key]["networkmanager"];
            } else {
                /*
                If the interface doesn't have addresses options, make sure the interface itself has renderer: NetworkManager
                */
                if (has_address_options == false) {
                    iface["renderer"] = "NetworkManager";
                }
            }

            if (object_type == "wifis") {
                if ("access-points" in iface) {
                    Object.keys(iface["access-points"]).forEach(function (ap_key) {
                        if ("networkmanager" in iface["access-points"][ap_key] && renderer != "NetworkManager") {
                            delete object["network"][object_type][key]["access-points"][ap_key]["networkmanager"];
                        } else {
                            /*
                            If the interface doesn't have addresses options, make sure the interface itself has renderer: NetworkManager
                            */
                            if (has_address_options == false) {
                                iface["renderer"] = "NetworkManager";
                            }
                        }
                    });
                }
            }
        }
    });
}

const destDir = "fakedata";

fs.mkdirSync(destDir, { recursive: true });

const ethernets = JSONSchemaFaker.generate(ethernets_schema);
apply_fixes(ethernets, "ethernets")
var filename = randomBytes(32).toString('hex') + '.yaml';
writeYamlFile.sync(`${destDir}/${filename}`, ethernets, {mode: 0o600});

const wifis = JSONSchemaFaker.generate(wifis_schema);
apply_fixes(wifis, "wifis")
var filename = randomBytes(32).toString('hex') + '.yaml';
writeYamlFile.sync(`${destDir}/${filename}`, wifis, {mode: 0o600});

const vrfs = JSONSchemaFaker.generate(vrfs_schema);
apply_fixes(vrfs, "vrfs")
var filename = randomBytes(32).toString('hex') + '.yaml';
writeYamlFile.sync(`${destDir}/${filename}`, vrfs, {mode: 0o600});

const vlans = JSONSchemaFaker.generate(vlans_schema);
apply_fixes(vlans, "vlans")
var filename = randomBytes(32).toString('hex') + '.yaml';
writeYamlFile.sync(`${destDir}/${filename}`, vlans, {mode: 0o600});

const bridges = JSONSchemaFaker.generate(bridges_schema);
apply_fixes(bridges, "bridges")
var filename = randomBytes(32).toString('hex') + '.yaml';
writeYamlFile.sync(`${destDir}/${filename}`, bridges, {mode: 0o600});

const bonds = JSONSchemaFaker.generate(bonds_schema);
apply_fixes(bonds, "bonds")
var filename = randomBytes(32).toString('hex') + '.yaml';
writeYamlFile.sync(`${destDir}/${filename}`, bonds, {mode: 0o600});

const wireguard = JSONSchemaFaker.generate(wireguard_schema);
apply_fixes(wireguard, "tunnels");
var filename = randomBytes(32).toString('hex') + '.yaml';
writeYamlFile.sync(`${destDir}/${filename}`, wireguard, {mode: 0o600});

const sit = JSONSchemaFaker.generate(sit_schema);
apply_fixes(sit, "tunnels");
var filename = randomBytes(32).toString('hex') + '.yaml';
writeYamlFile.sync(`${destDir}/${filename}`, sit, {mode: 0o600});

const vxlans = JSONSchemaFaker.generate(vxlan_schema);
apply_fixes(vxlans, "tunnels");
var filename = randomBytes(32).toString('hex') + '.yaml';
writeYamlFile.sync(`${destDir}/${filename}`, vxlans, {mode: 0o600});

const nmdevices = JSONSchemaFaker.generate(nmdevices_schema);
var filename = randomBytes(32).toString('hex') + '.yaml';
writeYamlFile.sync(`${destDir}/${filename}`, nmdevices, {mode: 0o600});

const modems = JSONSchemaFaker.generate(modems_schema);
var filename = randomBytes(32).toString('hex') + '.yaml';
writeYamlFile.sync(`${destDir}/${filename}`, modems, {mode: 0o600});

const ovs = JSONSchemaFaker.generate(openvswitch_schema);
var filename = randomBytes(32).toString('hex') + '.yaml';
writeYamlFile.sync(`${destDir}/${filename}`, ovs, {mode: 0o600});
