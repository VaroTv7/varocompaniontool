import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');
const CONFIG_FILE = path.join(ASSETS_DIR, 'config.json');

// Ensure directory exists
if (!fs.existsSync(ASSETS_DIR)) {
    try {
        fs.mkdirSync(ASSETS_DIR, { recursive: true });
    } catch (e) { console.error("Assets dir creation failed", e); }
}

export interface AppConfig {
    apiKey?: string;
}

export function getConfig(): AppConfig {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Read Config Failed", e);
    }
    return {};
}

export function saveConfig(config: AppConfig) {
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    } catch (e) {
        console.error("Write Config Failed", e);
        throw e;
    }
}
