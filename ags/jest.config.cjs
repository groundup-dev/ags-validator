module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Use ts-jest to transform TypeScript files
  },
  
  // setupFilesAfterEnv: ['./jest.setup.js'], // Adjust if you have setup files
};
