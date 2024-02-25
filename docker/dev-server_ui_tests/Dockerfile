
FROM node:18.19.0-slim AS base_build

LABEL maintainer="stevenengland"
LABEL vendor="stevenengland"

ARG  \
# Needed for fixing permissions of files created by Docker:
  UID=1001 \
  GID=1001 \
# `IOB_DEVSERVER_PROFILE` arg is used to make different builds:
  IOB_DEVSERVER_PROFILE \
  IOB_USER=iobroker


# ENV IOB_DEVSERVER_PROFILE=${IOB_DEVSERVER_PROFILE} \
  # node:
  # ... \
  # npm:
  # ... \

SHELL ["/bin/bash", "-eo", "pipefail", "-c"]

WORKDIR /iobroker-adapter

RUN groupadd -g "${GID}" -r ${IOB_USER} && \
    useradd -d '/iobroker-adapter' -g ${IOB_USER} -l -r -u "${UID}" ${IOB_USER} && \
    chown ${IOB_USER} -R '/iobroker-adapter'

COPY --chown=${IOB_USER} ./src/ ./src/
COPY --chown=${IOB_USER} ./admin/ ./admin/
COPY --chown=${IOB_USER} ./test/ ./test/

COPY --chown=${IOB_USER} [ \
  "tsconfig.json", \
  "tsconfig.build.json", \
  "package.json", \
  "package-lock.json", \
  "io-package.json", \
  "./" \
]

# System deps (we don't use exact versions because it is hard to update them, pin when needed):
RUN \
    apt-get update && apt-get upgrade -y && \
    apt-get install --no-install-recommends -y \
      bash \
      curl \
      git \
      tini \
      wait-for-it && \
    tini --version && \
# Cleaning cache:
    apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false && \
    apt-get clean -y && rm -rf /var/lib/apt/lists/*

# This is a special case. We need to run this script as an entry point:
COPY --chown=${IOB_USER} ./docker/dev-server_ui_tests/entrypoint.sh ./docker-entrypoint.sh


RUN chmod +x './docker-entrypoint.sh' \
  # Replacing line separator CRLF with LF for Windows users:
  && sed -i 's/\r$//g' './docker-entrypoint.sh'

# Running as non-root user:
USER ${IOB_USER}

# Node deps
RUN npm install

RUN mkdir -p './.dev-server'

CMD ["/usr/bin/tini", "--", "./docker-entrypoint.sh"]