/**
 * Obfuscation Configuration for XCoin-RN
 * 
 * Aggressive settings for production builds.
 * This config is used by obfuscator-io-metro-plugin.
 * 
 * WARNING: These settings may increase build time significantly.
 */

module.exports = {
    // Compact code (remove whitespace)
    compact: true,

    // Control Flow Flattening - makes code flow harder to understand
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75, // Apply to 75% of code

    // Dead Code Injection - adds fake code
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4, // 40% fake code ratio

    // Debug Protection - DISABLED for Hermes compatibility
    debugProtection: false,
    debugProtectionInterval: 0,

    // Identifier Names - use hexadecimal names
    identifierNamesGenerator: 'hexadecimal',

    // Rename Globals - DISABLED for React Native compatibility
    renameGlobals: false,

    // Self Defending - DISABLED for Hermes bytecode compatibility
    selfDefending: false,

    // String Array - move strings to array
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,

    // Split Strings - break strings into chunks
    splitStrings: true,
    splitStringsChunkLength: 10,

    // Transform Object Keys
    transformObjectKeys: true,

    // Unicode Escape - DISABLED for readability
    unicodeEscapeSequence: false,

    // Source Map - disable in production
    sourceMap: false,
};
