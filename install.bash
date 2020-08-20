#!/bin/bash
# Installs the `fiftyone` package and its dependencies.
#
# Usage:
#   bash install.bash
#
# Copyright 2017-2020, Voxel51, Inc.
# voxel51.com
#

# Show usage information
usage() {
    echo "Usage:  bash $0 [-h] [-d]

Getting help:
-h      Display this help message.

Custom installations:
-d      Install developer dependencies. The default is false.
"
}


# Parse flags
SHOW_HELP=false
DEV_INSTALL=false
while getopts "hd" FLAG; do
    case "${FLAG}" in
        h) SHOW_HELP=true ;;
        d) DEV_INSTALL=true ;;
        *) usage ;;
    esac
done
[ ${SHOW_HELP} = true ] && usage && exit 0

set -e
OS=$(uname -s)

echo "***** INSTALLING ETA *****"
if [[ ! -d "eta" ]]; then
    echo "Cloning ETA repository"
    git clone https://github.com/voxel51/eta
fi
cd eta
pip install -e .
if [[ ! -f config.json ]]; then
    echo "Installing default ETA config"
    cp config-example.json config.json
fi
cd ..


echo "***** INSTALLING PLAYER51 *****"
git submodule update --init --recursive

echo "***** INSTALLING MONGODB *****"
mkdir -p ~/.fiftyone/bin
cd ~/.fiftyone
mkdir -p var/log/mongodb
mkdir -p var/lib/mongo
if [ -x bin/mongod ]; then
    echo "MongoDB already installed"
elif [ "${OS}" == "Darwin" ]; then
    curl https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-4.2.6.tgz --output mongodb.tgz
    tar -zxvf mongodb.tgz
    mv mongodb-macos-x86_64-4.2.6/bin/* ./bin/
    rm mongodb.tgz
    rm -rf mongodb-macos-x86_64-4.2.6
elif [ "${OS}" == "Linux" ]; then
    curl https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1804-4.2.6.tgz --output mongodb.tgz
    tar -zxvf mongodb.tgz
    mv mongodb-linux-x86_64-ubuntu1804-4.2.6/bin/* ./bin/
    rm mongodb.tgz
    rm -rf mongodb-linux-x86_64-ubuntu1804-4.2.6
else
    echo "WARNING: unsupported OS, skipping MongoDB installation"
fi
cd -


echo "***** INSTALLING NVM, YARN, AND ELECTRON APP *****"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

#
# Detect profile file if not specified as environment variable
# (eg: PROFILE=~/.myprofile)
# The echo'ed path is guaranteed to be an existing file
# Otherwise, an empty string is returned
#
nvm_detect_profile() {
  if [ "${PROFILE-}" = '/dev/null' ]; then
    # the user has specifically requested NOT to have nvm touch their profile
    return
  fi

  if [ -n "${PROFILE}" ] && [ -f "${PROFILE}" ]; then
    echo "${PROFILE}"
    return
  fi

  local DETECTED_PROFILE
  DETECTED_PROFILE=''

  if [ -n "${BASH_VERSION-}" ]; then
    if [ -f "$HOME/.bashrc" ]; then
      DETECTED_PROFILE="$HOME/.bashrc"
    elif [ -f "$HOME/.bash_profile" ]; then
      DETECTED_PROFILE="$HOME/.bash_profile"
    fi
  elif [ -n "${ZSH_VERSION-}" ]; then
    DETECTED_PROFILE="$HOME/.zshrc"
  fi

  if [ -z "$DETECTED_PROFILE" ]; then
    for EACH_PROFILE in ".profile" ".bashrc" ".bash_profile" ".zshrc"
    do
      if DETECTED_PROFILE="$(nvm_try_profile "${HOME}/${EACH_PROFILE}")"; then
        break
      fi
    done
  fi

  if [ -n "$DETECTED_PROFILE" ]; then
    echo "$DETECTED_PROFILE"
  fi
}
source "$NVM_PROFILE"

nvm install v12.16.2
nvm use v12.16.2
npm install -g yarn
cd electron
yarn install
cd ..


echo "***** INSTALLING FIFTYONE *****"
if [ ${DEV_INSTALL} = true ]; then
    echo "Performing dev install"
    pip install -r requirements/dev.txt
    pre-commit install
else
    pip install -r requirements.txt
fi
pip install -e .


echo "***** INSTALLATION COMPLETE *****"
