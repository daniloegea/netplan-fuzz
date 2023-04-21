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


fs.mkdirSync("fakeroot/etc/netplan", { recursive: true });

const ethernets = jsf.generate(ethernets_schema);
writeYamlFile.sync('fakeroot/etc/netplan/ethernets.yaml', ethernets);
fs.chmodSync('fakeroot/etc/netplan/ethernets.yaml', 0o600);

const wifis = jsf.generate(wifis_schema);
writeYamlFile.sync('fakeroot/etc/netplan/wifis.yaml', wifis);
fs.chmodSync('fakeroot/etc/netplan/wifis.yaml', 0o600);

const vrfs = jsf.generate(vrfs_schema);
writeYamlFile.sync('fakeroot/etc/netplan/vrfs.yaml', vrfs);
fs.chmodSync('fakeroot/etc/netplan/vrfs.yaml', 0o600);

const vlans = jsf.generate(vlans_schema);
writeYamlFile.sync('fakeroot/etc/netplan/vlans.yaml', vlans);
fs.chmodSync('fakeroot/etc/netplan/vlans.yaml', 0o600);

const bridges = jsf.generate(bridges_schema);
writeYamlFile.sync('fakeroot/etc/netplan/bridges.yaml', bridges);
fs.chmodSync('fakeroot/etc/netplan/bridges.yaml', 0o600);

const bonds = jsf.generate(bonds_schema);
writeYamlFile.sync('fakeroot/etc/netplan/bonds.yaml', bonds);
fs.chmodSync('fakeroot/etc/netplan/bonds.yaml', 0o600);