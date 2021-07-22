<div align="center">

# How to Contribute

</div>

Dmod is an open source discovery platform for moderators on Discord. We’re still working out the kinks to make contributing to this project as easy and transparent as possible. Hopefully this document makes the process for contributing clear and answers some questions that you may have.

## Code of Conduct

Our code of conduct is a work in progress, for now please avoid offensive language and keep conversation civil.

## Development

All work on Dmod happens directly on GitHub. Both core team members and external contributors send pull requests which go through the same review process.

## Versioning

Dmod follows semantic versioning. We release patch versions for critical bugfixes, minor versions for new features or non-essential changes, and major versions for any breaking changes. When we make breaking changes, we also introduce deprecation warnings in a minor version so that our users learn about the upcoming changes and migrate their code in advance. Learn more about our commitment to stability and incremental migration in our versioning policy.

Every significant change is documented in the changelog file.

## Bugs

### Where to Find Known Issues

We are using GitHub Issues for our public bugs. We keep a close eye on this and try to make it clear when we have an internal fix in progress. Before opening a new issue, try to make sure your problem doesn’t already exist.

### Reporting New Issues

The best way to get your bug fixed is to provide clear instructions on where to find it and/or how to reproduce it.

### Security Bugs

Dmod supports the safe disclosure of security bugs. With that in mind, do not file public issues; please contact a core team member directly.

## How to Get in Touch

Our official Discord server: https://dmod.gg/discord/ is an active community of Dmod users that you can turn to when you need help. We also have an internal support team that can be contacted on the Discord server.

## Proposing a Change

If you intend to change the public API, or make any non-trivial changes to the website, we recommend filing an issue. This lets us reach an agreement on your proposal before you put significant effort into it.

If you’re only fixing a bug, it’s fine to submit a pull request right away but we still recommend to open an issue detailing what you’re fixing. This is helpful in case we don’t accept that specific fix but want to keep track of the issue.

## Your First Pull Request

To help you get your feet wet and get you familiar with our contribution process, we have a list of [good first issues](https://github.com/dmod-gg/dmod/issues?q=is:open+is:issue+label:%22good+first+issue%22) that contain bugs that have a relatively limited scope. This is a great place to get started.

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix. If nobody is working on it at the moment, please leave a comment stating that you intend to work on it so other people don’t accidentally duplicate your effort.

If somebody claims an issue but doesn’t follow up for more than two weeks, it’s fine to take it over but you should still leave a comment.

## Pull Requests

The core team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation. For API changes we may need to fix our internal uses, which could cause some delay. We’ll do our best to provide updates and feedback throughout the process.

Before submitting a pull request, please make sure the following is done:

1. Fork the repository and create your branch from master
2. Run `npm i` in the repository root
3. Rename `.example.env` to `.env` and fill in the information
4. Install [redis](https://redis.io/) to your system. And start up the redis server. [Windows Help](https://github.com/ServiceStack/redis-windows)
5. Run `npm run dev` to test in the production environment
6. Format your code (automatic formatting coming soon)
7. Open the pull request

## Development Workflow

> Work in progress

## Request for Comments (RFC)

Many changes, including bug fixes and improvements can be implemented and reviewed via the normal GitHub pull request workflow.

Some changes though are “substantial”, and we ask that these be put through a bit of a design process and produce a consensus among the Dmod core team.

The "RFC" (request for comments) process is intended to provide a consistent and controlled path for new features to enter the project.

## License

By contributing to Dmod, you agree that your contributions will be licensed under its `GNU GPLv3` license.
