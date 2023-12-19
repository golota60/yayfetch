# Hey 👋!
Thanks for looking here. Contributions are welcome! If you've got any questions when it comes to setup(or the project overall), feel free to open an issue/start a discussion


# Running the project
We're using pnpm instead of npm, so make sure you've got it installed(`npm install -g pnpm`).

1. Clone the repository
2. run `pnpm install` in the root directory of the project
3. run `pnpm start <flags>` to run the project

# Other commands

| script           | description                        |
| ---------------- | :--------------------------------- |
| `pnpm lint`  | Lint staged code                   |
| `pnpm test ` | Test your code with jest           |
| `pnpm build` | Build the app                      |

# Releasing

To release:

1. Checkout a new branch `git checkout -b chore/release`
2. Run `pnpm release` and then `pnpm publish`. Push changes.
3. Merge the release branch