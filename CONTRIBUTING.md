# How to Contribute

Of course we welcome contributions to the UOR Framework Documentation!

To get started, clone the repository and start a local build of the site.

For this you will need:
* git cli
* docker-compose

```sh
git clone https://github.com/uor-framework/uor-framework.github.io
cd uor-framework.github.io
```

To start with podman:

```sh
podman play kube podman.yaml
podman logs --follow uor-framework-hugo
```

To start with docker-compose:

```sh
docker-compose up
```

You can now reach your local build of the docs at http://localhost:3000

----------------------------------------

## Contributor License Agreement

Contributions to this project must be accompanied by a Contributor License
Agreement. You (or your employer) retain the copyright to your contribution;
this simply gives us permission to use and redistribute your contributions as
part of the project. Head over to <https://cla.developers.google.com/> to see
your current agreements on file or to sign a new one.

You generally only need to submit a CLA once, so if you've already submitted one
(even if it was for a different project), you probably don't need to do it
again.

## Code reviews

All submissions, including submissions by project members, require review. We
use GitHub pull requests for this purpose. Consult
[GitHub Help](https://help.github.com/articles/about-pull-requests/) for more
information on using pull requests.

## Community Guidelines

This project follows
[Google's Open Source Community Guidelines](https://opensource.google.com/conduct/).
