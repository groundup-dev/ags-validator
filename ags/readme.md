# Ags Validation Library

This is a TypeScript library for validating AGS (Association of Geotechnical & Geoenvironmental Specialists) data files. 
## Features

- Validates AGS4 data files 
- Provides detailed error reporting
- Supports all versions of AGS4

## Installation

To install the AGS Validation Library, use npm:

```bash
npm install @groundup-dev/ags
```

## Usage

```javascript

import {
  validateAgsData,

} from "@groundup-dev/ags";

const agsData = "" // your ags data as string

const dictVersion = "v4_0_4"
// options:
// "v4_0_3" | "v4_1_1" | "v4_1" | "v4_0_4";

const { errors, parsedData } = validateAgsData(agsData, dictVersion)


```






