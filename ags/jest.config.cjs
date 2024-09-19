module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    
    moduleFileExtensions: ['ts', 'js'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest', // Use ts-jest to transform TypeScript files
    },
    globals: {
     
    },
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1', // Map 'src/' to the actual folder
    },
  };
  