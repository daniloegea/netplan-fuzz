import jsf from "json-schema-faker";
import writeYamlFile from 'write-yaml-file';
import { JSONSchemaFaker } from "json-schema-faker";
import { faker } from '@faker-js/faker';

import * as fs from 'node:fs';

import ethernets_schema from './ethernets.js';
import wifis_schema from './wifis.js';
import vrfs_schema from './vrfs.js';

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
writeYamlFile('fakeroot/etc/netplan/ethernets.yaml', ethernets);

const wifis = jsf.generate(wifis_schema);
writeYamlFile('fakeroot/etc/netplan/wifis.yaml', wifis);

const vrfs = jsf.generate(vrfs_schema);
writeYamlFile('fakeroot/etc/netplan/vrfs.yaml', vrfs);
