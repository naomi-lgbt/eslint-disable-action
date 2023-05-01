# Eslint Disable Action

This is a basic GitHub Action that checks specified directories for `eslint-disable` comments and fails the run if any are found.

## Usage

To use this action, create a workflow file in your repository's `.github/workflows` directory. An example workflow file is provided below.

```yml
name: Node.js CI
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  ci:
    name: Lint / Build / Test
    runs-on: ubuntu-20.04

    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - name: Checkout Source Files
        uses: actions/checkout@8e5e7e5ab8b370d6c329ec480221332ada57f0ab # v3

      - name: Use Node.js v${{ matrix.node-version }}
        uses: actions/setup-node@64ed1c7eab4cce3362f8c340dee64e5eaeef8f7c # v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install Dependencies
        run: npm ci

      - name: Check for eslint-disable
        uses: naomi-lgbt/eslint-disable-action@main
        with:
          directories: "src test"

      - name: Lint Source Files
        run: npm run lint

      - name: Verify Build
        run: npm run build

      - name: Run Tests
        run: npm run test
```

The `directories` input should be a list of file paths to check for `eslint-disable` comments. Paths should be **space separated**.

## Fail Mode

By default, the action will log errors and set a failed status if `eslint-disable` directives are found. If you'd rather see warnings and no failure status, set the `fail-mode` input to `false`.

```yml
      - name: Check for eslint-disable
        uses: naomi-lgbt/eslint-disable-action@main
        with:
          directories: "src test"
          fail-mode: false
```

## Feedback and Bugs

If you have feedback or a bug report, please feel free to open a GitHub issue!

## Contributing

If you would like to contribute to the project, you may create a Pull Request containing your proposed changes and we will review it as soon as we are able! Please review our [contributing guidelines](CONTRIBUTING.md) first.

## Code of Conduct

Before interacting with our community, please read our [Code of Conduct](CODE_OF_CONDUCT.md).

## Licensing

Copyright (C) 2023 Naomi Carrigan

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

The full license terms may be viewed in the [LICENSE.md file](./LICENSE.md)

## Contact

We may be contacted through our [Chat Server](http://chat.nhcarrigan.com) or via email at `contact@nhcarrigan.com`.
