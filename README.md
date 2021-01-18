<p align="center">
  <a href="https://github.com/InterficieIS/docker-version-bydate"><img alt="docker-version-bydate status" src="https://github.com/InterficieIS/docker-version-bydate/workflows/build-test/badge.svg"></a>
</p>

# Compute docker version by date

This action computes a new version number for docker images that depends on the current date and the previously released versions for the same date.

The action checks the docker hub registry and computes a version of the form:
```
YYYY.MMDD.counter
```
where `YYYY` is the current 4-digit year, `MMDD` are the month and day numbers (always using 2 digits), and `counter` is either `0` if this is the first release of the day, or the next version (previous counter + 1) otherwise.

## Inputs

### `image`

The image identifier of your docker image in docker hub (example: `repo/image`).

## Outputs

### `version`

The computed version for your new image.

## Example usage

```
uses: InterficieIS/docker-version-bydate
with:
  image: interficie/helvetia-php
```
