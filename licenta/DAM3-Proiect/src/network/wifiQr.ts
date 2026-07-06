export function formatWifiQr(ssid: string, pass: string, enc = 'WPA', hidden = false) { return `WIFI:T:${enc};S:${ssid};P:${pass};H:${hidden};;`; }

// WPA3, WPA2, WEP, Open supported
