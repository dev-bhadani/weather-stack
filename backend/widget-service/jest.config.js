module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    roots: ['<rootDir>/test'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,js}',
        '!src/**/*.d.ts'
    ]
};
