export default {
    root: 'basic-lessons/lesson-10/',
    publicDir: './static/', // Adjusted to be relative to the root
    base: './',


    server: {
        host: true, // Open to local network and display URL
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
    },
    build: {
        outDir: './dist', // Adjusted to output in the dist folder inside src
        emptyOutDir: true, // Empty the folder first
        sourcemap: true // Add sourcemap
    },
}
