/// <reference types="node" />
import http from 'http';
import { ServerConfig } from './interfaces/ServerConfig';
export declare const createServer: ({ port, connection }: ServerConfig) => Promise<http.Server>;
