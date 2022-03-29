# Hey 👋!
Thanks for looking here. Contributions are welcome! If you've got any questions when it comes to setup(or the project overall), feel free to open an issue/start a discussion


# Running the project
We're using yarn instead of npm, so make sure you've got it installed.

1. Clone the repository
2. run `yarn` in the root directory of the project
3. run `yarn start <flags>` to run the project

# Other commands

| script           | description                        |
| ---------------- | :--------------------------------- |
| `yarn run lint`  | Lint staged code                   |
| `yarn run jest ` | Test your code with jest           |
| `yarn run build` | Build the app                      |

# Releasing

To release:

1. Checkout a new branch `git checkout -b chore/release`
2. Run `yarn publish`. Push changes.
3. Merge the release branch