# How to Contribute

Of course we welcome contributions to the UOR Framework Documentation!

To get started, clone the repository and start a local build of the site.

For this you will need git and docker or podman installed.
* git cli
* docker (MacOS/Linux)
* podman (Linux)

```sh
git clone https://github.com/uor-framework/universalreference.io && cd universalreference.io
```

To start with docker-compose:

```sh
docker compose up
```

To start with docker run:

```sh
docker run -it --rm --name site --publish 3000:3000 --volume $(pwd):/src ghcr.io/uor-framework/site
```

To start with `podman play kube` (Linux only)

```sh
podman play kube podman.yaml
podman logs --follow uor-framework-site
```

To start with `podman run`:

```sh
podman run -it --rm --name site -p 3000:3000 --volume $(pwd):/src --security-opt label=disable --pull=never ghcr.io/uor-framework/site
```

You can now reach your local build of the docs at http://localhost:3000
