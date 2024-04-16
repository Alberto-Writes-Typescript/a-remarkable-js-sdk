# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.3] - 2024-04-16

### Fixed

- `TextEncoder` polyfill for library compatibility in all JS environments.

## [0.4.2] - 2024-04-16

### Fixed

- `RemarkableClient` `paired` method verifies presence of `Device`.
- `TextEncoder` polyfill for library compatibility in all JS environments.

## [0.4.1] - 2024-04-15

### Changed

- `RemarkableClient` factory method signatures do not require `deviceToken` parameter.

## [0.4.0] - 2024-04-15

### Added

- `RemarkableClient` method to pair new `Device`.
- `Device` `HttpClient` can be configured (before it was using `NodeClient` only).

## [0.3.0] - 2024-04-15

### Added

- `RemarkableClient` method to verify current session has not expired.
- Added `FileSystem` cache system via `FileSystemSnapshot`s.

### Changed

- `FileBuffer` interface handles `Buffer` objects instead of `ArrayBuffer`s.
- `FileSystem` now fetches `Document`s and `Folder`s directly from the reMarkable Cloud.

## [0.2.2] - 2024-04-11

### Fixed

- Inconsistencies with previous releases

## [0.2.1] - 2024-04-11

### Added

- `RemarkableClient` interface to interact with the reMarkable Cloud API services.

## [0.2.0] - 2024-04-11

### Added

- `fetch` client.

## [0.1.0] - 2024-04-08

### Added
- Device connection with reMarkable Cloud.
- User session authentication with reMarkable Cloud.
- PDF & ePub file upload to reMarkable Cloud.
- File Tree navigator.

[unreleased]: https://github.com/Alberto-Writes-Typescript/a-remarkable-js-sdk/compare/v0.4.3...HEAD
[0.4.3]: https://github.com/Alberto-Writes-Typescript/a-remarkable-js-sdk/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/Alberto-Writes-Typescript/a-remarkable-js-sdk/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/Alberto-Writes-Typescript/a-remarkable-js-sdk/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/Alberto-Writes-Typescript/a-remarkable-js-sdk/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Alberto-Writes-Typescript/a-remarkable-js-sdk/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/Alberto-Writes-Typescript/a-remarkable-js-sdk/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/Alberto-Writes-Typescript/a-remarkable-js-sdk/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/Alberto-Writes-Typescript/a-remarkable-js-sdk/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Alberto-Writes-Typescript/a-remarkable-js-sdk/releases/tag/v0.1.0