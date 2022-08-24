# With Podman (recommended)
# podman build --tag ghcr.io/uor-framework/site ./
# podman run -it --rm --name site -p 3000:3000 --volume .:/src --security-opt label=disable --pull=never ghcr.io/uor-framework/site
# docker run -it --rm --name site --publish 3000:3000 --volume .:/src --security-opt label=disable ghcr.io/uor-framework/site

FROM quay.io/fedora/fedora:latest AS builder

ENV ROOTFS_PATH="/rootfs"
ENV DNF_FLAGS="\
  --setopt install_weak_deps=false \
  --releasever rawhide \
  -y --nodocs --nogpg \
"
ENV RPM_LIST="\
  npm \
  glibc-minimal-langpack \
  coreutils-single \
  openssl \
"

RUN set -ex \
 && mkdir -p ${ROOTFS_PATH} \
 && dnf install --installroot ${ROOTFS_PATH} ${DNF_FLAGS} ${RPM_LIST} \
 && dnf clean all --installroot ${ROOTFS_PATH} \
 && rm -rf ${ROOTFS_PATH}/var/cache/* \
 && echo


FROM scratch
COPY --from=builder /rootfs /
WORKDIR /src
ENTRYPOINT ["bash", "-c", "npm install && npm run start"]
LABEL org.opencontainers.image.source https://github.com/uor-framework/uor-framework.github.io
