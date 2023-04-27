import jsf from "json-schema-faker";
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
import {wireguard_schema, sit_schema, vxlan_schema} from './tunnels.js';
import modems_schema from './modems.js';
import openvswitch_schema from './openvswitch.js'


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

/*
If addresses as objects were generated, set the renderer to networkd.
NetworkManager doesn't support addresses options
*/
function check_and_fix_addresses(object, object_type) {
    if (!("network" in object) || !(object_type in object["network"])) {
        return;
    }
    var interfaces = object["network"][object_type]
    Object.keys(interfaces).forEach(function (key) {
        if (key != "renderer") {
            var iface = interfaces[key];

            if ("addresses" in iface) {
                Object.keys(iface["addresses"]).forEach(function(key) {
                    if (typeof iface["addresses"][key] === 'object') {
                        interfaces["renderer"] = "networkd";
                        object["network"]["renderer"] = "networkd";
                        iface["renderer"] = "networkd";
                        return;
                    }
                });
            }
        }
    });
}

fs.mkdirSync("fakeroot/etc/netplan", { recursive: true });

const ethernets = jsf.generate(ethernets_schema);
check_and_fix_addresses(ethernets, "ethernets")
writeYamlFile.sync('fakeroot/etc/netplan/ethernets.yaml', ethernets);
fs.chmodSync('fakeroot/etc/netplan/ethernets.yaml', 0o600);

const wifis = jsf.generate(wifis_schema);
check_and_fix_addresses(wifis, "wifis")
writeYamlFile.sync('fakeroot/etc/netplan/wifis.yaml', wifis);
fs.chmodSync('fakeroot/etc/netplan/wifis.yaml', 0o600);

const vrfs = jsf.generate(vrfs_schema);
writeYamlFile.sync('fakeroot/etc/netplan/vrfs.yaml', vrfs);
fs.chmodSync('fakeroot/etc/netplan/vrfs.yaml', 0o600);

const vlans = jsf.generate(vlans_schema);
check_and_fix_addresses(vlans, "vlans")
writeYamlFile.sync('fakeroot/etc/netplan/vlans.yaml', vlans);
fs.chmodSync('fakeroot/etc/netplan/vlans.yaml', 0o600);

const bridges = jsf.generate(bridges_schema);
check_and_fix_addresses(bridges, "bridges")
writeYamlFile.sync('fakeroot/etc/netplan/bridges.yaml', bridges);
fs.chmodSync('fakeroot/etc/netplan/bridges.yaml', 0o600);

const bonds = jsf.generate(bonds_schema);
check_and_fix_addresses(bonds, "bonds")
writeYamlFile.sync('fakeroot/etc/netplan/bonds.yaml', bonds);
fs.chmodSync('fakeroot/etc/netplan/bonds.yaml', 0o600);

const wireguard = jsf.generate(wireguard_schema);
writeYamlFile.sync('fakeroot/etc/netplan/wireguard.yaml', wireguard);
fs.chmodSync('fakeroot/etc/netplan/wireguard.yaml', 0o600);

const sit = jsf.generate(sit_schema);
writeYamlFile.sync('fakeroot/etc/netplan/sit.yaml', sit);
fs.chmodSync('fakeroot/etc/netplan/sit.yaml', 0o600);

const vxlans = jsf.generate(vxlan_schema);
writeYamlFile.sync('fakeroot/etc/netplan/vxlans.yaml', vxlans);
fs.chmodSync('fakeroot/etc/netplan/vxlans.yaml', 0o600);

const nmdevices = jsf.generate(nmdevices_schema);
writeYamlFile.sync('fakeroot/etc/netplan/nmdevices.yaml', nmdevices);
fs.chmodSync('fakeroot/etc/netplan/nmdevices.yaml', 0o600);

const modems = jsf.generate(modems_schema);
writeYamlFile.sync('fakeroot/etc/netplan/modems.yaml', modems);
fs.chmodSync('fakeroot/etc/netplan/modems.yaml', 0o600);

const ovs = jsf.generate(openvswitch_schema);
writeYamlFile.sync('fakeroot/etc/netplan/openvswitch.yaml', ovs);
fs.chmodSync('fakeroot/etc/netplan/openvswitch.yaml', 0o600);
