/**
 * Hache une chaîne de caractères en utilisant l'algorithme SHA-256.
 * @async
 * @param {string} string - La chaîne de caractères à hacher.
 * @returns {Promise<string>} Une promesse qui se résout avec le hash hexadécimal.
 */
async function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
    return hashHex;
}

/**
 * Compare une chaîne de caractères avec un hash donné.
 * @async
 * @param {string} string - La chaîne de caractères à comparer.
 * @param {string} hashString - Le hash à comparer.
 * @returns {Promise<boolean>} Une promesse qui se résout avec true si les hash correspondent, false sinon.
 */
async function compareHash(string, hashString) {
    return hashString === await hash(string);
}

export { hash, compareHash };
